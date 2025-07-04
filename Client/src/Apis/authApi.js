import axios from "./axios";

export const googleAuth = async (credential) => {
  try {
    const response = await axios.post("/auth/google", credential);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const sendOTP = async (email, action) => {
  try {
    const response = await axios.post("/otp/send-otp", { email, action });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const register = async (name, email, password, otp) => {
  try {
    const response = await axios.post("/user/register", {
      name,
      email,
      password,
      otp,
    });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const login = async (email, password, otp) => {
  try {
    const response = await axios.post("/user/login", { email, password, otp });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const setPassword = async (password) => {
  try {
    const response = await axios.patch("/user/setPassword", { password });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const updatePassword = async (oldPassword, newPassword) => {
  try {
    const response = await axios.patch("/user/updatePassword", {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const logout = async () => {
  try {
    const response = await axios.post("/user/logout");
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const logoutAll = async () => {
  try {
    const response = await axios.post("/user/logout-all");
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};
