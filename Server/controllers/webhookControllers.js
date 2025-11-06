import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import CustomError from "../utils/ErrorResponse.js";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";
import { getPlanDetailsById } from "../utils/getPlanDetails.js";
import { StatusCodes } from "http-status-codes";
import FileSerivces from "../services/file/index.js";
import File from "../models/fileModel.js";
import { razorpayInstance } from "../services/razorpayService.js";

// route -> /webhook/razorpay
export const razorpayWebhookController = async (req, res, next) => {
  const webhookBody = req.body;
  const webhookSignature = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  let message = "OK";
  // verify signature from the header
  const isValidRequest = validateWebhookSignature(
    JSON.stringify(webhookBody),
    webhookSignature,
    webhookSecret
  );

  if (!isValidRequest) {
    throw new CustomError("Signature not valid", StatusCodes.BAD_REQUEST);
  }

  const event = req.body.event;

  switch (event) {
    case "subscription.activated":
      message = await handleActivateEvent(webhookBody);
      break;
    case "subscription.cancelled":
      message = await handleCancelledEvent(webhookBody);
      break;
    case "subscription.paused":
      message = "User account has been disabled";
      break;
    case "subscription.resumed":
      message = "User account has been recovered";
      break;
    default:
      break;
  }

  console.log(event, message);

  return res.status(StatusCodes.OK).send(message);
};

async function handleActivateEvent(eventBody) {
  const webhookSubscription = eventBody.payload.subscription.entity;
  const userId = webhookSubscription.notes.userId;

  const currentSubscription = await Subscription.findOne({
    razorpaySubscriptionId: webhookSubscription.id,
    userId,
  });

  if (!currentSubscription) {
    return "No matching subscription found, webhook ignored";
  }

  if (currentSubscription.status === "pending_upgrade") {
    // find the old_subscription from DB
    const oldSubscription = await Subscription.findOne({
      userId,
      status: "active",
    });

    if (oldSubscription) {
      // Cancel old Razorpay subscription
      await razorpayInstance.subscriptions.cancel(
        oldSubscription.razorpaySubscriptionId,
        false // cancels the subscription immediately, not at the end of the cycle.
      );

      // Remove old subscription record
      await Subscription.deleteOne({ _id: oldSubscription._id });
    }
  }

  // update the user subscription document
  const updateSubscriptionDoc = await Subscription.findOneAndUpdate(
    {
      userId,
      razorpaySubscriptionId: webhookSubscription.id,
    },
    {
      status: "active",
      currentPeriodStart: webhookSubscription.current_start * 1000,
      currentPeriodEnd: webhookSubscription.current_end * 1000,
      startDate: webhookSubscription.start_at * 1000,
      endDate: webhookSubscription.end_at * 1000,
      invoiceId: eventBody.payload.payment.entity.invoice_id,
    },
    {
      new: true,
    }
  );

  // get planDetails from planId
  const planDetails = getPlanDetailsById(updateSubscriptionDoc.planId);

  // update the user with updated storageLimit
  await User.findByIdAndUpdate(webhookSubscription.notes.userId, {
    maxStorageLimit: planDetails.limits.storageBytes,
    maxFileSize: planDetails.limits.maxFileSizeBytes,
    maxDevices: planDetails.limits.maxDevices,
    subscriptionId: updateSubscriptionDoc._id,
  });

  return "Activated event handled";
}

async function handleCancelledEvent(eventBody) {
  const webhookSubscription = eventBody.payload.subscription.entity;

  const user = await User.findById(webhookSubscription.notes.userId)
    .populate("subscriptionId")
    .lean();

  // Case 1 -> User account has been deleted and subscription has cancelled.
  if (!user) {
    return "User not found, webhook ignored";
  }

  const subscriptionDocument = await Subscription.findOne({ userId: user._id, razorpaySubscriptionId: webhookSubscription.id });
  if (!subscriptionDocument) {
    return "Subscription not found for user, webhook ignored";
  }

  // Case 2 -> User planned to take another subscription and previous one has cancelled.
  if (subscriptionDocument.status === "created") {
    return "User selected different plan, webhook ignored";
  }

  // Case 3 -> Subscription cancelled event triggered due to user cancelled it from the UI/cancel-API.
  if (subscriptionDocument.status === "cancelled") {
    // 0) get free-plan (default) details
    const defaultPlan = getPlanDetailsById("default");

    // 1) Revoke user access (storageLimit, maxDevice, fileLimit, etc...)
    await User.findByIdAndUpdate(user._id, {
      subscriptionId: null,
      maxStorageLimit: defaultPlan.limits.storageBytes,
      maxDevices: defaultPlan.limits.maxDevices,
      maxFileSize: defaultPlan.limits.maxFileSizeBytes,
    });

    // 2) Delete all the files uploaded under the subscription period.
    const filesUploadedInSubscription = await File.find({
      userId: user._id,
      createdAt: { $gte: new Date(subscriptionDocument.startDate) },
    });

    // delete each file from DB and S3
    for (const file of filesUploadedInSubscription) {
      await FileSerivces.DeleteFileService(file._id, user._id);
    }

    // 3) Delete the subscription document
    await subscriptionDocument.deleteOne();

    return "Cancelled subscription & revoked acess";
  }
}
