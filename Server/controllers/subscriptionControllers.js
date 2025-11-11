import { SubscriptionServices } from "../services/index.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { validateInputs } from "../utils/ValidateInputs.js";
import {
  changePlanSchema,
  createSubscriptionSchema
} from "../validators/commonValidation.js";

export const createSubscription = async (req, res, next) => {
  try {
    const { planId } = validateInputs(createSubscriptionSchema, req.body);
    const userId = req.user._id;
    const { message, status, data } =
      await SubscriptionServices.CreateSubscription(userId, planId);
    return CustomSuccess.send(res, message, status, data);
  } catch (error) {
    next(error);
  }
};

export const checkSubscripitonStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userDetails = req.user;
    const { message, status, data } = await SubscriptionServices.Status(
      userId,
      userDetails
    );
    return CustomSuccess.send(res, message, status, data);
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    const { message, status } =
      await SubscriptionServices.CancelSubscription(user);
    return CustomSuccess.send(res, message, status);
  } catch (error) {
    next(error);
  }
};

export const plansEligibleforChange = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const subscriptionId = req.user.subscriptionId;
    const { message, status, data } =
      await SubscriptionServices.GetEligiblePlansForChange(
        userId,
        subscriptionId
      );
    return CustomSuccess.send(res, message, status, data);
  } catch (error) {
    next(error);
  }
};

export const changePlan = async (req, res, next) => {
  try {
    const { changePlanId } = validateInputs(changePlanSchema, req.body);
    const user = req.user;
    const { message, status, data } = await SubscriptionServices.ChangePlan(
      changePlanId,
      user
    );
    return CustomSuccess.send(res, message, status, data);
  } catch (error) {
    next(error);
  }
};
