import axios from "./axios";

export const getUserDetails = async () => {
  try {
    const response = await axios.get("/user");
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const disableAccount = async () => {
  try {
    const response = await axios.patch("/user/disable");
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await axios.delete("/user/delete");
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const UserSettings = async () => {
  try {
    const response = await axios.get("/user/settings");
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const UpdateUserSettings = async (formData) => {
  try {
    const response = await axios.post("/user/updateProfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get("/user/all-users");
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};
