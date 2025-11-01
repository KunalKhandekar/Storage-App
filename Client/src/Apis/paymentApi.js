import axios from "./axios";

export const handleCreateSubscription = async (planId) => {
  try {
    const response = await axios.post(`/subscription/create`, { planId });
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};
