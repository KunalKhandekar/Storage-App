import axios from "./axios";

export const googleAuth = async (code) => {
  try {
    const response = await axios.post("/auth/google", { code });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const driveConnect = async (code) => {
  try {
    const response = await axios.post("/auth/google/drive/connect", { code });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const driveProgress = async () => {
  try {
    const response = await axios.get("/auth/drive-progress");
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const sendOTP = async (email, action, password) => {
  try {
    const response = await axios.post("/otp/send-otp", {
      email,
      password,
      action,
    });
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

export const isAuthenticated = async () => {
  try {
    const response = await axios.get("/user");
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const regenerateSession = async (login_token) => {
  try {
    const response = await axios.post("/user/session", {
      temp_token: login_token,
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
