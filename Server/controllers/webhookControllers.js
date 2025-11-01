import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import CustomError from "../utils/ErrorResponse.js";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";
import { getPlanDetailsById } from "../utils/getPlanDetails.js";
import { StatusCodes } from "http-status-codes";

export const razorpayWebhookController = async (req, res, next) => {
  const webhookBody = req.body;
  const webhookSignature = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
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
      handleActivateEvent(webhookBody);
      break;
    default:
      break;
  }

  console.log(event);
  return res.status(200).send("OK");
};

async function handleActivateEvent(eventBody) {
  const webhookSubscription = eventBody.payload.subscription.entity;

  // update the user subscription document
  const updateSubscriptionDoc = await Subscription.findOneAndUpdate(
    {
      userId: webhookSubscription.notes.userId,
      razorpaySubscriptionId: webhookSubscription.id,
    },
    {
      status: "active",
      currentPeriodStart: webhookSubscription.current_start,
      currentPeriodEnd: webhookSubscription.current_end,
      startDate: webhookSubscription.start_at,
      endDate: webhookSubscription.end_at,
    },
    {
      new: true,
    }
  );

  // get planDetails from planId
  const planDetails = getPlanDetailsById(updateSubscriptionDoc.planId);

  // update the user with updated storageLimit
  await User.findByIdAndUpdate(webhookSubscription.notes.userId, {
    maxStorageLimit: planDetails.maxStorageLimit,
    subscriptionId: updateSubscriptionDoc._id,
  });
}
