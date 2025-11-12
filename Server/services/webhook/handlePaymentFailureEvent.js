import Subscription from "../../models/subscriptionModel.js";


export default async function handlePaymentFailureEvent(eventBody) {
  const webhookSubscription = eventBody.payload.subscription.entity;
  const userId = webhookSubscription.notes.userId;

  const subscription = await Subscription.findOne({
    userId,
    razorpaySubscriptionId: webhookSubscription.id,
  });

  if (!subscription) return "No subscription found in pending event";

  subscription.status = "renewal_failed";
  await subscription.save();

  return "Handled subscription.pending event";
}