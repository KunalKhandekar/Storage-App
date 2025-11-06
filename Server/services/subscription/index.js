import { StatusCodes } from "http-status-codes";
import Subscription from "../../models/subscriptionModel.js";
import CustomError from "../../utils/ErrorResponse.js";
import { razorpayInstance } from "../razorpayService.js";

export const cancelSubscriptionService = async (subscriptionId) => {
  const razorpayResponse =
    await razorpayInstance.subscriptions.cancel(subscriptionId);
  return { success: razorpayResponse?.status === "cancelled" };
};

export const createSubscriptionService = async (planId, userId) => {
  const razorpayResponse = await razorpayInstance.subscriptions.create({
    plan_id: planId,
    total_count: 12,
    notes: { userId: userId.toString() },
  });
  return {
    data: razorpayResponse?.status === "created" ? razorpayResponse : null,
  };
};

export const upgradeSubscriptionService = async ({
  userId,
  desirePlan,
}) => {
  // Create new subscription
  const { data } = await createSubscriptionService(desirePlan.id, userId);
  if (!data) {
    throw new CustomError(
      "Failed to create subscription",
      StatusCodes.BAD_REQUEST
    );
  }

  // update the DB with new subscription data.
  await Subscription.create({
    userId,
    planId: desirePlan.id,
    razorpaySubscriptionId: data.id,
    currentPeriodEnd: null,
    currentPeriodStart: null,
    endDate: null,
    startDate: null,
    invoiceId: null,
    status: "pending_upgrade",
  });

  return { newSubscriptionId: data.id };
};

export const downgradeSubscriptionService = async () => {};