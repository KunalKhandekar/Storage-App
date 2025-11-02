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
