import axios from "./axios";

export const handleCreateSubscription = async (planId) => {
  try {
    const response = await axios.post(`/subscription/create`, { planId });
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const checkSubscriptionStatus = async () => {
  try {
    const response = await axios.get(`/subscription/status`);
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const cancelSubscription = async () => {
  try {
    const response = await axios.delete(`/subscription/cancel`);
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const changePlan = async (planId) => {
  try {
    const response = await axios.post(`/subscription/changePlan`, {
      changePlanId: planId,
    });
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const plansEligibleforChange = async () => {
  try {
    const response = await axios.get(`/subscription/change-eligibility`);
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
}