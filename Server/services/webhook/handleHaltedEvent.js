import Subscription from "../../models/subscriptionModel.js";
import { cancelSubscriptionService } from "../../services/subscription/index.js";


export default async function handleHaltedEvent(eventBody) {
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