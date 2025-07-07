import axios from "./axios";

export const softDelete = async (userId) => {
  try {
    const response = await axios.delete(`/user/${userId}/delete/soft`);
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const hardDelete = async (userId) => {
  try {
    const response = await axios.delete(`/user/${userId}/delete/hard`);
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const logout = async (userId) => {
  try {
    const response = await axios.post(`/user/${userId}/logout`);
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const recover = async (userId) => {
  try {
    const response = await axios.patch(`/user/${userId}/recover`);
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const changeRole = async (userId, role) => {
  try {
    const response = await axios.post(`/user/${userId}/changeRole`, {
      newRole: role,
    });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getUserDirectory = async (userId, dirId) => {
  try {
    const response = await axios.get(`/user/${userId}/${dirId}`);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};
