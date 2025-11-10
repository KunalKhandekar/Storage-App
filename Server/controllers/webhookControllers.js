import { StatusCodes } from "http-status-codes";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import File from "../models/fileModel.js";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";
import FileSerivces from "../services/file/index.js";
import { razorpayInstance } from "../services/razorpayService.js";
import CustomError from "../utils/ErrorResponse.js";
import { getPlanDetailsById } from "../utils/getPlanDetails.js";
import Webhook from "../models/razorpayWebhookModel.js";
import { cancelSubscriptionService } from "../services/subscription/index.js";
import { sendEventToUser } from "./EventController.js";

// route -> /webhook/razorpay
export const razorpayWebhookController = async (req, res, next) => {
  const webhookBody = req.body;
  const webhookSignature = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  try {
    // Step 1 -> Verify webhook signature
    const isValidRequest = validateWebhookSignature(
      JSON.stringify(webhookBody),
      webhookSignature,
      webhookSecret
    );

    if (!isValidRequest) {
      throw new CustomError("Invalid signature", StatusCodes.BAD_REQUEST);
    }

    const event = webhookBody?.event;

    // Create a new Webhook document
    const webhookDoc = await Webhook.create({
      eventType: event,
      signature: webhookSignature,
      payload: webhookBody,
      razorpaySubscriptionId:
        webhookBody?.payload?.subscription?.entity?.id || null,
      razorpayPaymentId: webhookBody?.payload?.payment?.entity?.id || null,
      userId: webhookBody?.payload?.subscription?.entity?.notes?.userId || null,
      status: "pending",
    });

    // Handle the event
    let message = "Webhook received";
    switch (event) {
      case "subscription.charged":
        message = await handleChargedEvent(webhookBody);
        break;
      case "subscription.activated":
        message = await handleActivatedEvent(webhookBody);
        break;
      case "subscription.cancelled":
        message = await handleCancelledEvent(webhookBody);
        break;
      case "subscription.pending":
        message = await handlePaymentFailureEvent(webhookBody);
        break;
      case "subscription.halted":
        message = await handleHaltedEvent(webhookBody);
        break;
      case "subscription.paused":
        message = "User account paused";
        break;
      case "subscription.resumed":
        message = "User account resumed";
        break;
      default:
        message = `Unhandled event: ${event}`; // authenticated // updated // completed
        break;
    }

    console.log(`[${event}] - ${message}`);

    // Update webhook document as processed
    webhookDoc.status = "processed";
    webhookDoc.responseMessage = message;
    webhookDoc.processedAt = new Date();
    await webhookDoc.save();

    // Responding to Razorpay
    return res.status(StatusCodes.OK).send("Webhook processed successfully");
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    next(error);
  }
};

async function handleActivatedEvent(eventBody) {
  const webhookSubscription = eventBody.payload.subscription.entity;
  const userId = webhookSubscription.notes.userId;

  const currentSubscription = await Subscription.findOne({
    razorpaySubscriptionId: webhookSubscription.id,
    userId,
  });

  if (!currentSubscription) {
    return "No matching subscription found, webhook ignored";
  }

  if (currentSubscription.status === "active") {
    return "Subscription already active — webhook ignored";
  }

  if (currentSubscription.status === "pending") {
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

  sendEventToUser(userId, {
    type: "subscriptionActivated",
    plan: planDetails.name,
    message: "Your subscription has been activated!",
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

  const subscriptionDocument = await Subscription.findOne({
    userId: user._id,
    razorpaySubscriptionId: webhookSubscription.id,
  });
  if (!subscriptionDocument) {
    return "Subscription not found for user, webhook ignored";
  }

  // Case 2 -> User planned to take another subscription and previous one has cancelled.
  if (subscriptionDocument.status === "created") {
    return "User selected different plan, webhook ignored";
  }

  // Case 3 -> Subscription cancelled event triggered due to user cancelled it from the UI/cancel-API OR revoked the mandate
  if (
    subscriptionDocument.status === "cancelled" ||
    webhookSubscription.status === "cancelled"
  ) {
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

async function handleChargedEvent(eventBody) {
  const webhookSubscription = eventBody.payload.subscription.entity;
  const userId = webhookSubscription.notes.userId;

  // Find active or renewal_failed subscriptions
  const subscriptionDoc = await Subscription.findOne({
    userId,
    razorpaySubscriptionId: webhookSubscription.id,
    status: { $in: ["active", "renewal_failed"] },
  });

  if (!subscriptionDoc) {
    return "Subscription not active yet — skipping renewal logic";
  }

  // Update billing cycle info
  subscriptionDoc.currentPeriodStart = webhookSubscription.current_start * 1000;
  subscriptionDoc.currentPeriodEnd = webhookSubscription.current_end * 1000;
  subscriptionDoc.invoiceId = eventBody.payload.payment.entity.invoice_id;
  subscriptionDoc.status = "active"; // incase of renewal_retry
  await subscriptionDoc.save();

  console.log(`🔁 Subscription renewed successfully for user ${userId}`);

  return "Handled next_due — subscription renewed";
}

async function handlePaymentFailureEvent(eventBody) {
  const webhookSubscription = eventBody.payload.subscription.entity;
  const userId = webhookSubscription.notes.userId;

  const subscription = await Subscription.findOne({
    userId,
    razorpaySubscriptionId: webhookSubscription.id,
  });

  if (!subscription) return "No subscription found in pending event";

  subscription.status = "renewal_failed";
  await subscription.save();

  console.log(
    `⚠️ Subscription pending for user ${userId} — awaiting retry or user action`
  );

  return "Handled subscription.pending event";
}

async function handleHaltedEvent(eventBody) {
  const webhookSubscription = eventBody.payload.subscription.entity;
  const userId = webhookSubscription.notes.userId;

  const subscription = await Subscription.findOne({
    userId,
    razorpaySubscriptionId: webhookSubscription.id,
  });

  if (!subscription) return "No subscription found in pending event";

  const { success } = await cancelSubscriptionService(
    subscription.razorpaySubscriptionId
  );

  return success
    ? `Subscription cancelled for user ${userId} — retries exhausted`
    : `Failed to cancel subscription for user ${userId}`;
}
