import { StatusCodes } from "http-status-codes";
import Subscription from "../../models/subscriptionModel.js";
import CustomError from "../../utils/ErrorResponse.js";
import { razorpayInstance } from "../razorpayService.js";
import Directory from "../../models/dirModel.js";
import { formatFileSize } from "../../utils/formatFileSize.js";

/**
 * Create a new subscription on Razorpay
 */
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

/**
 * Cancel existing Razorpay subscription
 */
export const cancelSubscriptionService = async (subscriptionId) => {
  const razorpayResponse =
    await razorpayInstance.subscriptions.cancel(subscriptionId);
  return { success: razorpayResponse?.status === "cancelled" };
};

/**
 * Helper function to create a new subscription record in DB and Razorpay
 */
const handleNewSubscriptionCreation = async (userId, planId, status) => {
  const { data } = await createSubscriptionService(planId, userId);
  if (!data) {
    throw new CustomError(
      "Failed to create subscription",
      StatusCodes.BAD_REQUEST
    );
  }

  await Subscription.create({
    userId: userId,
    planId: planId,
    razorpaySubscriptionId: data.id,
    currentPeriodEnd: null,
    currentPeriodStart: null,
    endDate: null,
    startDate: null,
    invoiceId: null,
    status: status,
  });

  return { newSubscriptionId: data.id };
};

/**
 * Upgrade or cycle-change service
 */
export const upgradeSubscriptionService = async ({ userId, desirePlan }) => {
  return handleNewSubscriptionCreation(userId, desirePlan.id, "pending");
};

/**
 * Downgrade service (with storage limit check)
 */
export const downgradeSubscriptionService = async ({ user, desirePlan }) => {
  // 1. Check for storage limits before downgrading
  const rootDir = await Directory.findOne({
    _id: user.rootDirId,
    userId: user._id,
  })
    .select("size")
    .lean();

  if (!rootDir) {
    throw new CustomError("Root directory not found", StatusCodes.NOT_FOUND);
  }

  const rootDirSize = rootDir.size;
  const desirePlanMaxStorageLimit = desirePlan.limits.storageBytes;

  if (rootDirSize > desirePlanMaxStorageLimit) {
    const excessStorage = rootDirSize - desirePlanMaxStorageLimit;
    throw new CustomError(
      `Your current storage usage exceeds the desired plan's limit by ${formatFileSize(excessStorage)}. Please free up at least ${formatFileSize(excessStorage)} of storage before downgrading.`,
      StatusCodes.BAD_REQUEST
    );
  }

  // 2. Proceed with subscription creation
  return handleNewSubscriptionCreation(user._id, desirePlan.id, "pending");
};
