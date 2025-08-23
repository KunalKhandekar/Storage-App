import { StatusCodes } from "http-status-codes";
import { UserServices } from "../services/index.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { validateInputs } from "../utils/ValidateInputs.js";
import { passwordSchema, roleSchema } from "../validators/commonValidation.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import Directory from "../models/dirModel.js";

export const getUserInfo = async (req, res) => {
  const rootDir = await Directory.findById(req.user?.rootDirId)
    .select("size")
    .lean();
  return CustomSuccess.send(res, null, StatusCodes.OK, {
    email: req.user?.email,
    name: req.user?.name,
    picture: req.user?.picture,
    role: req.user?.role,
    maxStorageLimit: req.user?.maxStorageLimit,
    usedStorageLimit: rootDir.size,
    availableStorageLimit: req.user?.maxStorageLimit - rootDir.size,
  });
};

export const logoutUser = async (req, res, next) => {
  try {
    const { token } = req.signedCookies;
    await UserServices.LogoutUserService(token);
    res.clearCookie("token");
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (req, res, next) => {
  try {
    await UserServices.LogoutAllUserService(req.user._id);
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  const currentUser = req.user;
  try {
    const Users = await UserServices.GetAllUserService(currentUser);
    CustomSuccess.send(res, null, StatusCodes.OK, {
      Users,
      currentUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutSpecificUser = async (req, res, next) => {
  const currentUser = req.user;
  const { userId } = req.params;
  try {
    await UserServices.LogoutSpecificUserService(userId, currentUser);
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const softDeleteUser = async (req, res, next) => {
  const currentUser = req.user;
  const { userId } = req.params;
  try {
    await UserServices.SoftDeleteUserService(userId, currentUser);
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const hardDeleteUser = async (req, res, next) => {
  const currentUser = req.user;
  const { userId } = req.params;
  try {
    await UserServices.HardDeleteUserService(userId, currentUser);
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const recoverUser = async (req, res, next) => {
  const currentUser = req.user;
  const { userId } = req.params;
  try {
    await UserServices.RecoverUserService(userId, currentUser);
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const getSettingDetails = async (req, res, next) => {
  const {
    name,
    email,
    canLoginWithPassword,
    createdWith,
    picture,
    maxStorageLimit,
  } = req.user;
  const rootDir = await Directory.findById(req.user.rootDirId)
    .select("size")
    .lean();
  const settings = {
    name,
    email,
    picture,
    manualLogin: canLoginWithPassword,
    socialLogin: createdWith !== "email",
    socialProvider: createdWith === "email" ? null : createdWith,
    maxStorageLimit,
    usedStorageLimit: rootDir.size,
    availableStorageLimit: maxStorageLimit - rootDir.size,
  };
  return CustomSuccess.send(res, null, StatusCodes.OK, settings);
};

export const setPasswordForManualLogin = async (req, res, next) => {
  const { password } = req.body;
  const userId = req.user._id;
  try {
    const parsedPassword = validateInputs(passwordSchema, password);
    await UserServices.SetPasswordService(userId, parsedPassword);
    return CustomSuccess.send(
      res,
      "Your password has been updated",
      StatusCodes.OK
    );
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;
  try {
    const parsedOldPassword = validateInputs(passwordSchema, oldPassword);
    const parsedNewPassword = validateInputs(passwordSchema, newPassword);
    await UserServices.UpdatePasswordService(
      userId,
      parsedOldPassword,
      parsedNewPassword
    );
    return CustomSuccess.send(
      res,
      "Your password has been updated",
      StatusCodes.OK
    );
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  const name = req.body.name;
  const userId = req.user._id;
  const file = req.file;
  try {
    const sanitizedName = sanitizeInput(name);
    await UserServices.UpdateProfileService(userId, file, sanitizedName);
    return CustomSuccess.send(res, "Profile Updated.", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const disableUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    await UserServices.DisableUserService(userId);
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    await UserServices.DeleteUserService(userId);
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (req, res, next) => {
  const { userId } = req.params;
  const currentUser = req.user;
  const { newRole } = req.body;
  try {
    const parsedRole = validateInputs(roleSchema, newRole);
    const target_user = await UserServices.ChangeRoleService(
      parsedRole,
      currentUser,
      userId
    );
    return CustomSuccess.send(
      res,
      `${target_user.name} role has been changed to ${newRole}`,
      StatusCodes.OK
    );
  } catch (error) {
    next(error);
  }
};

export const getSpecificUserDirectory = async (req, res, next) => {
  const { userId, dirId } = req.params;

  try {
    const directory = await UserServices.GetSpecificUserDirectoryService(
      userId,
      dirId
    );
    return CustomSuccess.send(res, null, StatusCodes.OK, directory);
  } catch (error) {
    next(error);
  }
};

export const getFile = async (req, res, next) => {
  const { userId, fileId } = req.params;
  try {
    const { fileName, filePath } = await UserServices.GetFileService(
      fileId,
      userId
    );
    if (req.query.action === "download") {
      return res.download(filePath, fileName);
    }
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
