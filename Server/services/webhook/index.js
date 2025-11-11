import handleActivatedEvent from "./handleActivatedEvent.js";
import handleCancelledEvent from "./handleCancelledEvent.js";
import handleChargedEvent from "./handleChargedEvent.js";
import handlePaymentFailureEvent from "./handlePaymentFailureEvent.js";
import handlePausedEvent from "./handlePausedEvent.js";
import handleResumeEvent from "./handleResumeEvent.js";
import handleHaltedEvent from "./handleHaltedEvent.js";

async function RazorpayEventHandler(event, webhookBody) {
  switch (event) {
    case "subscription.activated":
      return handleActivatedEvent(webhookBody);
    case "subscription.cancelled":
      return handleCancelledEvent(webhookBody);
    case "subscription.charged":
      return handleChargedEvent(webhookBody);
    case "subscription.pending":
      return handlePaymentFailureEvent(webhookBody);
    case "subscription.paused":
      return handlePausedEvent(webhookBody);
    case "subscription.resumed":
      return handleResumeEvent(webhookBody);
    case "subscription.halted":
      return handleHaltedEvent(webhookBody);
    default:
      return `Unhandled event: ${event}`;
  }
}

export default {
  RazorpayEventHandler
}