import { StatusCodes } from "http-status-codes";
import Subscription from "../../models/subscriptionModel.js";
import { getPlanDetailsById } from "../../utils/getPlanDetails.js";
import CustomError from "../../utils/ErrorResponse.js";
import { razorpayInstance } from "../razorpayService.js";

export default async function createSubscription(userId, planId) {
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
        return {
          status: StatusCodes.CREATED,
          message: "Subscription already exist in created status.",
          data: { subscriptionId: subscriptionDoc.razorpaySubscriptionId },
        };
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

      return {
        status: StatusCodes.CREATED,
        message: "Subscription created successfully",
        data: { subscriptionId: subscription.id },
      };
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

  return {
    status: StatusCodes.CREATED,
    message: "Subscription created successfully",
    data: { subscriptionId: subscription.id },
  };
}
