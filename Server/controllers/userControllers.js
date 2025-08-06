import { hash } from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { rm } from "node:fs/promises";
import path from "node:path";
import { absolutePath, rootPath } from "../app.js";
import redisClient from "../config/redis.js";
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import CustomError from "../utils/ErrorResponse.js";
import CustomSuccess from "../utils/SuccessResponse.js";

// Utility Function
const canPerform = (actorRole, targetRole) => {
  const hierarchy = ["User", "Manager", "Admin", "SuperAdmin"];
  return hierarchy.indexOf(actorRole) > hierarchy.indexOf(targetRole);
};

export const getUserInfo = (req, res) => {
  return CustomSuccess.send(res, null, StatusCodes.OK, {
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
    role: req.user.role,
  });
};

export const logoutUser = async (req, res, next) => {
  try {
    const { token } = req.signedCookies;
    await redisClient.del(`session:${token}`);
    res.clearCookie("token");
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (req, res, next) => {
  try {
    await redisClient.deleteManySessions(req.user._id);
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUser = req.user;

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

    CustomSuccess.send(res, null, StatusCodes.OK, {
      Users,
      currentUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutSpecificUser = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

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
    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const softDeleteUser = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId }).select("role");

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

    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const hardDeleteUser = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

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

    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const recoverUser = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { userId } = req.params;

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

    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const getSettingDetails = async (req, res, next) => {
  const { name, email, canLoginWithPassword, createdWith, picture } = req.user;
  const settings = {
    name,
    email,
    picture,
    manualLogin: canLoginWithPassword,
    socialLogin: createdWith !== "email",
    socialProvider: createdWith === "email" ? null : createdWith,
  };
  return CustomSuccess.send(res, null, StatusCodes.OK, settings);
};

export const setPasswordForManualLogin = async (req, res, next) => {
  const { password } = req.body;
  try {
    const hashedPassword = await hash(password, 10);

    await User.findByIdAndUpdate(req.user._id, {
      $set: { password: hashedPassword, canLoginWithPassword: true },
    });
    return CustomSuccess.send(
      res,
      "Your password has been updated",
      StatusCodes.OK
    );
  } catch (error) {
    console.log(error);
    throw new CustomError(
      "Something went wrong while setting password",
      StatusCodes.BAD_GATEWAY
    );
  }
};

export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!(await user.comparePassword(oldPassword))) {
      throw new CustomError(
        "Cannot change password, old password is not valid.",
        StatusCodes.CONFLICT
      );
    }
    user.password = newPassword;
    await user.save();
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
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (user.name !== name) {
      user.name = name;
    }
    if (req.file && req.file.filename) {
      // Delete the old Image
      if (user.picture.includes("profilePictures")) {
        await rm(
          `${rootPath}/profilePictures/${user.picture.split("/").pop()}`
        );
      }
      user.picture = `${process.env.BASE_URL}/profilePictures/${req.file.filename}`;
    }
    await user.save();

    return CustomSuccess.send(res, "Profile Updated.", StatusCodes.OK);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const disableUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

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

    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }

    // Deleting all sessions of the user
    await redisClient.deleteManySessions(user._id);

    // delete all files of the user (virtual and local)
    const allFiles = await File.find({ userId: user._id });
    for (const file of allFiles) {
      await rm(path.join(absolutePath, file.storedName));
      await file.deleteOne();
    }

    // delete all folder of the user
    await Directory.deleteMany({ userId: user._id });

    // delete the user Data itself
    await user.deleteOne();

    return CustomSuccess.send(res, null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;
    const { newRole } = req.body;
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
      throw new CustomError(
        "You cannot promote yourself.",
        StatusCodes.CONFLICT
      );
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
    const targetUser = await User.findOne({ _id: userId })
      .select("-password")
      .lean();
    const directoryData = dirId
      ? await Directory.findOne({
          _id: dirId,
          userId,
        }).lean()
      : await Directory.findOne({
          userId,
          parentDirId: null,
        });

    if (!directoryData)
      throw new CustomError("Directory data not found.", StatusCodes.CONFLICT);

    const files = (
      await File.find({ parentDirId: directoryData?._id }).lean()
    ).map((file) => ({ ...file, type: "file" }));

    const directories = (
      await Directory.find({ parentDirId: directoryData?._id }).lean()
    ).map((dir) => ({ ...dir, type: "directory" }));

    return CustomSuccess.send(res, null, StatusCodes.OK, {
      ...directoryData,
      files,
      directories,
      targetUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getFile = async (req, res, next) => {
  const { userId, fileId } = req.params;
  try {
    const fileObj = await File.findOne({
      _id: fileId,
      userId: userId,
    });

    if (!fileObj) {
      throw new CustomError("File not found", StatusCodes.NOT_FOUND);
    }

    const filePath = path.join(absolutePath, fileObj.storedName);

    if (req.query.action === "download") {
      return res.download(filePath, fileObj.name);
    }

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
