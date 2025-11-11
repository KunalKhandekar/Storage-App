import Subscription from "../../models/subscriptionModel.js";


export default async function handleChargedEvent(eventBody) {
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