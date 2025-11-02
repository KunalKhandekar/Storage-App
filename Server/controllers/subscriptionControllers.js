import { StatusCodes } from "http-status-codes";
import Subscription from "../models/subscriptionModel.js";
import { razorpayInstance } from "../services/razorpayService.js";
import CustomError from "../utils/ErrorResponse.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { getPlanDetailsById } from "../utils/getPlanDetails.js";
import File from "../models/fileModel.js";
import Directory from "../models/dirModel.js";
import redisClient from "../config/redis.js";

const getDayRemaining = (futureDate) => {
  const fDate = new Date(futureDate);
  const today = new Date();
  // Difference in milliseconds
  const diffMs = fDate - today;
  // Convert ms → days
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const createSubscription = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const planDetails = getPlanDetailsById(planId);

    // Checking if planId is valid
    if (!planDetails) {
      throw new CustomError("Plan ID is not valid", StatusCodes.BAD_REQUEST);
    }

    const subscriptionDoc = await Subscription.findOne({ userId });

    if (subscriptionDoc) {
      if (subscriptionDoc.status === "active") {
        throw new CustomError(
          "You already have an active subscription",
          StatusCodes.BAD_REQUEST
        );
      }

      // planId is same then return the same subscriptionId
      if (
        subscriptionDoc.planId === planId &&
        subscriptionDoc.status === "created"
      ) {
        const razorpaySub = await razorpayInstance.subscriptions.fetch(
          subscriptionDoc.razorpaySubscriptionId
        );
        if (razorpaySub.status === "created") {
          return CustomSuccess.send(
            res,
            "Subscription already exist in created status.",
            StatusCodes.CREATED,
            { subscriptionId: subscriptionDoc.razorpaySubscriptionId }
          );
        } else {
          throw new CustomError(
            "Subscription is not the same as in Database",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
      }

      // User selected different planId
      if (
        subscriptionDoc.planId !== planId &&
        subscriptionDoc.status === "created"
      ) {
        // Cancel the old plan from razorpay.
        await razorpayInstance.subscriptions.cancel(
          subscriptionDoc.razorpaySubscriptionId
        );
        // keeping the DB status as created because creating new again and updating the document.

        // Create new selected plan and update the document
        const subscription = await razorpayInstance.subscriptions.create({
          plan_id: planId,
          total_count: 12,
          notes: { userId: userId.toString() },
        });

        await Subscription.findByIdAndUpdate(subscriptionDoc._id, {
          planId: planId,
          razorpaySubscriptionId: subscription.id,
          status: subscription.status,
        });

        return CustomSuccess.send(
          res,
          "Subscription created successfully",
          StatusCodes.CREATED,
          { subscriptionId: subscription.id }
        );
      }
    }

    const subscription = await razorpayInstance.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      notes: { userId: userId.toString() },
    });

    if (!subscription) {
      throw new CustomError(
        "Failed to create subscription",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    await Subscription.create({
      planId: subscription.plan_id,
      userId,
      razorpaySubscriptionId: subscription.id,
      currentPeriodEnd: null,
      currentPeriodStart: null,
      endDate: null,
      startDate: null,
      status: "created",
    });

    return CustomSuccess.send(
      res,
      "Subscription created successfully",
      StatusCodes.CREATED,
      { subscriptionId: subscription.id }
    );
  } catch (error) {
    next(error);
  }
};

export const checkSubscripitonStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userDetails = req.user;
    const subscriptionDoc = await Subscription.findOne({ userId }).lean();
    if (subscriptionDoc && subscriptionDoc.status === "active") {
      const planDetails = getPlanDetailsById(subscriptionDoc.planId);
      const totalFiles = await File.countDocuments({ userId }).lean();
      const now = new Date();
      const filesUploadedThisMonth = await File.countDocuments({
        createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
      });
      const rootDirSize = (
        await Directory.findById(userDetails.rootDirId).select("size").lean()
      ).size;
      const sharedFiles = await File.countDocuments({
        userId,
        $or: [
          { "sharedViaLink.enabled": true },
          { sharedWith: { $not: { $size: 0 } } },
        ],
      });
      const activeSession = await redisClient.countUserSessions(userId);

      return CustomSuccess.send(res, "Active plan found!", StatusCodes.OK, {
        subscription: {
          hasActivePlan: true,
          status: subscriptionDoc.status,
          planId: subscriptionDoc.planId,
          planName: planDetails.name,
          planTagLine: planDetails.tagline,
          planPrice: planDetails.price,
          billingCycle: planDetails.billingCycle,
          nextBillingDate: subscriptionDoc.currentPeriodEnd,
          daysUntilRenewal: getDayRemaining(subscriptionDoc.currentPeriodEnd),
          features: planDetails.features,
          cancellationScheduled: false, // for cancellation grace_period
          cancellationDate: null, // for cancellation grace_period
        },
        usage: {
          maxFileUploadSize: planDetails.limits.maxFileSize,
          storageUsed: rootDirSize, //
          storageTotal: userDetails.maxStorageLimit,
          storagePercentage: (
            (rootDirSize / userDetails.maxStorageLimit) *
            100
          ).toFixed(1),
          totalFiles: totalFiles, // All files of the user
          sharedFiles, // total files shared by user.
          devicesConnected: activeSession, // Total device login session
          maxDevices: planDetails.limits.maxDevices, // Max device as per the plan
          filesUploadedThisMonth, // understand it from the createdAt field of files
        },
      });
    }
    throw new CustomError("No active plan found!", StatusCodes.NOT_FOUND);
  } catch (error) {
    next(error);
  }
};

// {
//   "subscription": {
//     "hasActivePlan": true,
//     "status": "active",
//     "planId": "plan_Ra0GqWQ6p0ffYM",
//     "planName": "Pro",
//     "planPrice": "299",
//     "billingCycle": "monthly",
//     "nextBillingDate": "2024-11-02T00:00:00Z",
//     "daysUntilRenewal": 30, // Calculate it
//     "cancellationScheduled": false, // for cancellation grace_period
//     "cancellationDate": null // for cancellation grace_period
//   },
//   "usage": {
//     "storageUsed": 45200000000, //
//     "storageTotal": 214748364800,
//     "storagePercentage": 22.6,
//     "totalFiles": 1247, // All files of the user
//     "sharedFiles": 23, // total files shared by user.
//     "devicesConnected": 2, // Total device login session
//     "maxDevices": 3, // Max device as per the plan
//     "filesUploadedThisMonth": 156, // understand it from the createdAt field of files
//   },
// }
