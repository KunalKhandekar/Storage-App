import Subscription from "../../models/subscriptionModel.js";
import User from "../../models/userModel.js";
import { razorpayInstance } from "../../services/razorpayService.js";
import { getPlanDetailsById } from "../../utils/getPlanDetails.js";
import { sendEventToUser } from "../../controllers/EventController.js";

export default async function handleActivatedEvent(eventBody) {
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
