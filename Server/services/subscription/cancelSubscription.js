import { StatusCodes } from "http-status-codes";
import Subscription from "../../models/subscriptionModel.js";
import CustomError from "../../utils/ErrorResponse.js";
import { razorpayInstance } from "../razorpayService.js";

export default async function cancelSubscription(user) {
  const subscriptionDoc = await Subscription.findOne({
    userId: user._id,
    _id: user.subscriptionId,
  });
  // Case 1 -> check don't have a subscription
  if (!subscriptionDoc || subscriptionDoc.status !== "active") {
    throw new CustomError("Subscription not found", StatusCodes.NOT_FOUND);
  }

  // Case 2 -> User has an acitve subscription
  // Calling razorpay cancel subscription API
  await razorpayInstance.subscriptions.cancel(
    subscriptionDoc.razorpaySubscriptionId,
    false
  );

  // only setting the state to cancelled, revoke of benefits will be handled by webhook call
  subscriptionDoc.status = "cancelled";
  await subscriptionDoc.save();

  return {
    message: "Subscription cancelled.",
    status: StatusCodes.OK
  }
}
