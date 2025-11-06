import { StatusCodes } from "http-status-codes";
import Subscription from "../models/subscriptionModel.js";
import { razorpayInstance } from "../services/razorpayService.js";
import CustomError from "../utils/ErrorResponse.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { getPlanDetailsById } from "../utils/getPlanDetails.js";
import File from "../models/fileModel.js";
import Directory from "../models/dirModel.js";
import redisClient from "../config/redis.js";
import {
  cancelSubscriptionService,
  upgradeSubscriptionService,
} from "../services/subscription/index.js";
import { getPlanChangeType } from "../utils/getPlanChangeType.js";

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
        // also another reason cancelling the subscription will trigger the webhook event. (More explanation in webhook controller)

        // Create new selected plan and update the document
        const subscription = await razorpayInstance.subscriptions.create({
          plan_id: planId,
          total_count: 12,
          notes: { userId: userId.toString() },
        });

        await Subscription.findByIdAndUpdate(subscriptionDoc._id, {
          planId: planId,
          razorpaySubscriptionId: subscription.id,
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
      invoiceId: null,
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

    // if user has active subscription
    if (subscriptionDoc && subscriptionDoc.status === "active") {
      // get the plan details
      const planDetails = getPlanDetailsById(subscriptionDoc.planId);

      // total files of the user
      const totalFiles = await File.countDocuments({ userId }).lean();

      // total files uploaded during subscription period
      const filesUploadedInSubscription = await File.countDocuments({
        userId,
        createdAt: { $gte: new Date(subscriptionDoc.startDate) },
      });

      // Storage used based on root parent directory
      const rootDirSize = (
        await Directory.findById(userDetails.rootDirId).select("size").lean()
      ).size;

      // number of files shared by the user
      const sharedFiles = await File.countDocuments({
        userId,
        $or: [
          { "sharedViaLink.enabled": true },
          { sharedWith: { $not: { $size: 0 } } },
        ],
      });

      // number of active device sessions
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
          invoiceURL: `${process.env.RAZORPAY_INVOICE_LINK}${subscriptionDoc.invoiceId}`,
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
          filesUploadedInSubscription, // understand it from the createdAt field of files
        },
      });
    }
    throw new CustomError("No active plan found!", StatusCodes.NOT_FOUND);
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const subscriptionDoc = await Subscription.findOne({ userId });
    // Case 1 -> check don't have a subscription
    if (!subscriptionDoc || subscriptionDoc.status !== "active") {
      throw new CustomError("Subscription not found", StatusCodes.NOT_FOUND);
    }

    // Case 2 -> User has an acitve subscription
    // Calling razorpay cancel subscription API
    await razorpayInstance.subscriptions.cancel(
      subscriptionDoc.razorpaySubscriptionId,
      false
    );

    // only setting the state to cancelled, revoke of benefits will be handled by webhook call
    subscriptionDoc.status = "cancelled";
    await subscriptionDoc.save();

    return CustomSuccess.send(res, "Subscription cancelled.", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const changePlan = async (req, res, next) => {
  try {
    const { changePlanId } = req.body;
    const user = req.user;
    const subscriptionDocument = await Subscription.findById(
      user.subscriptionId
    ).lean();

    // Validate if user has an active subscription
    if (!subscriptionDocument || subscriptionDocument.status !== "active") {
      throw new CustomError(
        "Active subscription not found",
        StatusCodes.BAD_REQUEST
      );
    }

    // get plan details for the current and desire plans
    const currentPlan = getPlanDetailsById(subscriptionDocument.planId);
    const desirePlan = getPlanDetailsById(changePlanId);

    if (!desirePlan) {
      throw new CustomError(
        "Selected planId is not valid",
        StatusCodes.NOT_FOUND
      );
    }

    // Check whether user want to downgrade or upgrade the plan OR want to change the billing cylce
    switch (getPlanChangeType(currentPlan, desirePlan)) {
      case "invalid":
        throw new CustomError(
          "Invalid plan data received.",
          StatusCodes.BAD_REQUEST
        );

      // From Pro -> Premium AND Billing-Cycle change
      case "upgrade":
      case "cycle-change":
        const { newSubscriptionId } = await upgradeSubscriptionService({
          userId: user._id,
          desirePlan,
        });
        return CustomSuccess.send(
          res,
          "New subscription created for the selected plan",
          StatusCodes.CREATED,
          { newSubscriptionId }
        );

      // From Premium -> Pro
      case "downgrade":
        // check for maxLimit of the user before downgrading the plan.
        break;

      case "no-change":
        throw new CustomError(
          "Already on the same plan.",
          StatusCodes.BAD_REQUEST
        );
    }

    return CustomSuccess.send(res, "OK", StatusCodes.OK, {
      currentPlan,
      desirePlan,
    });
  } catch (error) {
    next(error);
  }
};
