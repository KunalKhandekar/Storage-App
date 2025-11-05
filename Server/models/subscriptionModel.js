import { model, Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    planId: {
      type: String,
      required: true,
    },
    razorpaySubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        "created", // subscription created but not paid
        "active", // payment success
        "past_due", // next payment failed
        "paused",
        "cancelled", // canceled immediately
        "in_grace", // user canceled but plan valid until grace period end
      ],
      default: "created",
    },
    currentPeriodStart: {
      type: Date,
      default: null,
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    invoiceId: {
      type: String,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    strict: "throw",
  }
);

const Subscription = model("Subscription", subscriptionSchema);
export default Subscription;
