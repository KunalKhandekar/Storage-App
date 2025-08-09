import { StatusCodes } from "http-status-codes";
import redisClient from "../../config/redis.js";
import CustomError from "../../utils/ErrorResponse.js";
import User from "../../models/userModel.js";
import { absolutePath, rootPath } from "../../app.js";
import { rm } from "node:fs/promises";
import Directory from "../../models/dirModel.js";
import File from "../../models/fileModel.js";
import { hash } from "bcrypt";
import path from "node:path";
import { DirectoryServices } from "../index.js";
import { canPerform } from "../../utils/canPerform.js";

const logoutUserService = async (token) => {
  await redisClient.del(`session:${token}`);
};

const logoutAllUserService = async (userId) => {
  await redisClient.deleteManySessions(userId);
};

const getAllUserService = async (currentUser) => {
  // Check if current user has permission to view all users
  if (currentUser.role === "User") {
    throw new CustomError(
      "Insufficient permissions to view all users",
      StatusCodes.FORBIDDEN
    );
  }

  const AllUsers = await User.find()
    .select("name email picture role isDeleted")
    .lean();
  const keys = await redisClient.keys("session:*");
  const sessions = await Promise.all(
    keys.map(async (key) => ({ data: await redisClient.json.get(key) }))
  );
  const sessionUserIds = new Set(sessions.map((s) => s.data.userId));

  const Users = AllUsers.filter(
    (user) => user._id.toString() !== currentUser._id.toString()
  ).map((user) => {
    return {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
      isDeleted: user.isDeleted,
      isLoggedIn: sessionUserIds.has(user._id.toString()),
    };
  });

  return Users;
};

const logoutSpecificUserService = async (userId, currentUser) => {
  const user = await User.findById(userId).select("role").lean();
  if (!user) {
    throw new CustomError("User not found", StatusCodes.NOT_FOUND);
  }

  if (!canPerform(currentUser.role, user.role)) {
    throw new CustomError(
      "Insufficient permissions to logout this user",
      StatusCodes.FORBIDDEN
    );
  }

  await redisClient.deleteManySessions(userId);
};

const softDeleteUserService = async (userId, currentUser) => {
  if (currentUser.role !== "SuperAdmin" && currentUser.role !== "Admin") {
    throw new CustomError(
      "You're not authorized to soft delete a user.",
      StatusCodes.BAD_REQUEST
    );
  }
  const user = await User.findOne({ _id: userId }).select("role isDeleted");

  console.log(user);

  if (!user) {
    throw new CustomError("User not found", StatusCodes.NOT_FOUND);
  }

  // Prevent self-deletion
  if (currentUser._id.toString() === user._id.toString()) {
    throw new CustomError(
      "Cannot delete your own account",
      StatusCodes.BAD_REQUEST
    );
  }

  // Check permissions
  if (!canPerform(currentUser.role, user.role)) {
    throw new CustomError(
      "Insufficient permissions to delete this user",
      StatusCodes.FORBIDDEN
    );
  }

  // Check if user is already deleted
  if (user.isDeleted) {
    throw new CustomError("User is already deleted", StatusCodes.CONFLICT);
  }

  // Deleting all sessions of the user
  await redisClient.deleteManySessions(userId);

  // Soft deleting user
  user.isDeleted = true;
  await user.save();
};

const hardDeleteUserService = async (userId, currentUser) => {
  
  const user = await User.findOne({ _id: userId }).select("role");

  if (!user) {
    throw new CustomError("User not found", StatusCodes.NOT_FOUND);
  }

  // Prevent self-deletion
  if (currentUser._id.toString() === user._id.toString()) {
    throw new CustomError(
      "Cannot hard delete your own account",
      StatusCodes.BAD_REQUEST
    );
  }

  // Check permissions
  if (currentUser.role !== "SuperAdmin" || user.role === "SuperAdmin") {
    throw new CustomError(
      "Insufficient permissions to hard delete this user",
      StatusCodes.FORBIDDEN
    );
  }

  // Deleting all sessions of the user
  await redisClient.deleteManySessions(userId);

  // delete all files of the user (virtual and local)
  const allFiles = await File.find({ userId: user._id });
  for (const file of allFiles) {
    await rm(path.join(absolutePath, file.storedName));
    await file.deleteOne();
  }

  // delete all folder of the user
  await Directory.deleteMany({ userId: user._id });

  // remove the user from sharedWith Arrays if exist.
  await File.updateMany(
    { "sharedWith.userId": user._id },
    { $pull: { sharedWith: { userId: user._id } } }
  );

  // delete the user Data itself
  await user.deleteOne();
};

const recoverUserService = async (userId, currentUser) => {
  const user = await User.findOne({ _id: userId }).select("role");

  if (!user) {
    throw new CustomError("User not found", StatusCodes.NOT_FOUND);
  }

  // Check permissions
  if (currentUser.role !== "SuperAdmin") {
    throw new CustomError(
      "Insufficient permissions to recover user",
      StatusCodes.FORBIDDEN
    );
  }

  user.isDeleted = false;
  await user.save();
};

const setPasswordService = async (userId, password) => {
  if (password.length <= 3) {
    throw new CustomError(
      "Password must be longer than 3 characters!",
      StatusCodes.CONFLICT
    );
  }
  const hashedPassword = await hash(password, 10);

  await User.findByIdAndUpdate(userId, {
    $set: { password: hashedPassword, canLoginWithPassword: true },
  });
};

const updatePasswordService = async (userId, oldPassword, newPassword) => {
  if (newPassword.length <= 3) {
    throw new CustomError(
      "Password must be longer than 3 characters!",
      StatusCodes.CONFLICT
    );
  }

  if (oldPassword === newPassword) {
    throw new CustomError(
      "Old and New password cannot be same!",
      StatusCodes.CONFLICT
    );
  }
  const user = await User.findOne({ _id: userId });
  if (!(await user.comparePassword(oldPassword))) {
    throw new CustomError(
      "Cannot change password, old password is not valid.",
      StatusCodes.CONFLICT
    );
  }
  user.password = newPassword;
  await user.save();
};

const updateProfileService = async (userId, file, name) => {
  const user = await User.findOne({ _id: userId }).select("-password");
  if (user.name !== name) {
    user.name = name;
  }
  if (file && file?.filename) {
    // Delete the old Image
    if (user.picture.includes("profilePictures")) {
      await rm(`${rootPath}/profilePictures/${user.picture.split("/").pop()}`);
    }
    user.picture = `${process.env.BASE_URL}/profilePictures/${file.filename}`;
  }
  await user.save();
};

const disableUserService = async (userId) => {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new CustomError("User not found", StatusCodes.NOT_FOUND);
  }

  // Check if user is already deleted
  if (user.isDeleted) {
    throw new CustomError("User is already deleted", StatusCodes.CONFLICT);
  }

  // Deleting all sessions of the user
  await redisClient.deleteManySessions(user._id);

  // Soft deleting user
  user.isDeleted = true;
  await user.save();
};

const deleteUserService = async (userId) => {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new CustomError("User not found", StatusCodes.NOT_FOUND);
  }

  // Deleting all sessions of the user
  await redisClient.deleteManySessions(user._id);

  // delete all files of the user (virtual and local)
  const allFiles = await File.find({ userId: user._id });
  for (const file of allFiles) {
    console.log(file);
    await rm(path.join(absolutePath, file.storedName));
    await file.deleteOne();
  }

  // delete all folder of the user
  await Directory.deleteMany({ userId: user._id });

  // delete the user Data itself
  await user.deleteOne();
};

const changeRoleService = async (newRole, currentUser, userId) => {
  const hierarchy = ["User", "Manager", "Admin", "SuperAdmin"];

  // Check for valid role.
  if (!hierarchy.includes(newRole)) {
    throw new CustomError(
      `Role is not valid as per the given standards, Given role is ${newRole}`,
      StatusCodes.CONFLICT
    );
  }

  // Prevent self promotion
  if (currentUser._id.toString() === userId) {
    throw new CustomError("You cannot promote yourself.", StatusCodes.CONFLICT);
  }

  // Restrict assigning higher roles
  if (currentUser.role !== "SuperAdmin" && newRole === "SuperAdmin") {
    throw new CustomError(
      "Only SuperAdmin can promote to SuperAdmin role",
      StatusCodes.CONFLICT
    );
  }

  const target_user = await User.findOne({ _id: userId }).select("role name");
  if (
    hierarchy.indexOf(target_user.role) >= hierarchy.indexOf(currentUser.role)
  ) {
    throw new CustomError(
      "You cannot change role of users higher than/Equal to your own level",
      StatusCodes.CONFLICT
    );
  }

  target_user.role = newRole;
  await target_user.save();

  return target_user;
};

const getSpecificUserDirectoryService = async (userId, dirId) => {
  const targetUser = await User.findOne({ _id: userId })
    .select("-password")
    .lean();
  const { _id, directory, files, name, parentDirId } =
    await DirectoryServices.GetDirectoryDataService(userId, dirId);
  return {
    files: files,
    directories: directory,
    targetUser,
    _id,
    name,
    parentDirId,
    userId,
  };
};

const getFileService = async (fileId, userId) => {
  const fileObj = await File.findOne({
    _id: fileId,
    userId: userId,
  });

  if (!fileObj) {
    throw new CustomError("File not found", StatusCodes.NOT_FOUND);
  }

  const filePath = path.join(absolutePath, fileObj.storedName);

  return { filePath, fileName: fileObj.name };
};

export default {
  LogoutUserService: logoutUserService,
  LogoutAllUserService: logoutAllUserService,
  GetAllUserService: getAllUserService,
  LogoutSpecificUserService: logoutSpecificUserService,
  SoftDeleteUserService: softDeleteUserService,
  HardDeleteUserService: hardDeleteUserService,
  RecoverUserService: recoverUserService,
  SetPasswordService: setPasswordService,
  UpdatePasswordService: updatePasswordService,
  UpdateProfileService: updateProfileService,
  DisableUserService: disableUserService,
  DeleteUserService: deleteUserService,
  ChangeRoleService: changeRoleService,
  GetSpecificUserDirectoryService: getSpecificUserDirectoryService,
  GetFileService: getFileService,
};
