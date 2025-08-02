import axios from "./axios";

export const generateShareLinkApi = async (fileId, permission) => {
  try {
    const response = await axios.post(`/file/share/${fileId}/link`, {
      enabled: true,
      permission,
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const shareWithEmail = async (fileId, users) => {
  try {
    const response = await axios.post(`/file/share/${fileId}/email`, { users });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const toggleLink = async (fileId, enabled) => {
  try {
    const response = await axios.patch(`/file/share/${fileId}/link/toggle`, {
      enabled,
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const changePermissionApi = async (fileId, permission) => {
  try {
    const response = await axios.patch(
      `/file/share/${fileId}/link/permission`,
      { permission }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getSharedUserAccessList = async (fileId) => {
  try {
    const response = await axios.get(`/file/share/access/${fileId}/list`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getShareDashboardInfo = async () => {
  try {
    const response = await axios.get("/file/share/dashboard");
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getViewFileByLink = async (fileId, token) => {
  try {
    const response = await axios.get(`/file/share/${fileId}?token=${token}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const changePermissionOfUserApi = async (fileId, userId, permission) => {
  try {
    const response = await axios.patch(
      `/file/share/update/permission/${userId}/${fileId}`,
      { permission }
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const revokeAccess = async (fileId, userId) => {
  try {
    const response = await axios.patch(
      `/file/share/access/revoke/${userId}/${fileId}`
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getFileInfo = async (fileId) => {
  try {
    const response = await axios.get(`/guest/file/${fileId}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getFilePermisssionInfo = async (fileId) => {
  try {
    const response = await axios.get(`/file/info/${fileId}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getSharedByMeFiles = async () => {
  try {
    const response = await axios.get(`/file/share/by-me`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getSharedWithMeFiles = async () => {
  try {
    const response = await axios.get(`/file/share/with-me`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const renameFileAsEditor = async (file, newName) => {
  try {
    const response = await axios.patch(`/file/share/edit/${file._id}`, {
      name: newName,
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getFileInfoByType = async (fileType, fileId) => {
  try {
    const response = await axios.get(`/file/share/info/${fileId}`);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
