import { StatusCodes } from "http-status-codes";
import Subscription from "../../models/subscriptionModel.js";
import CustomError from "../../utils/ErrorResponse.js";
import { getPlanDetailsById, getPlansEligibleForChange } from "../../utils/getPlanDetails.js";
import { getDayRemaining } from "../../utils/getDaysRemaining.js";

export default async function getEligiblePlansForChange(
  userId,
  subscriptionId
) {
  // find user's active subscription
  const subscriptionDoc = await Subscription.findOne({
    _id: subscriptionId,
    userId,
    status: "active",
  }).lean();

  if (!subscriptionDoc) {
    throw new CustomError("No active plan found!", StatusCodes.NOT_FOUND);
  }

  // eligible plan logic
  const eligiblePlans = getPlansEligibleForChange(subscriptionDoc.planId);
  // get the active plan details
  const planDetails = getPlanDetailsById(subscriptionDoc.planId);

  return {
    message: "You're eligible for a plan change",
    status: StatusCodes.OK,
    data: {
      activeSubscription: {
        planId: subscriptionDoc.planId,
        planName: planDetails.name,
        planTagLine: planDetails.tagline,
        planPrice: planDetails.price,
        billingCycle: planDetails.billingCycle,
        nextBillingDate: subscriptionDoc.currentPeriodEnd,
        daysUntilRenewal: getDayRemaining(subscriptionDoc.currentPeriodEnd),
        features: planDetails.features,
      },
      EligiblePlanIds: eligiblePlans,
    }
  }
}
