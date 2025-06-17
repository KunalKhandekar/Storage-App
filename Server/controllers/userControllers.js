import mongoose, { Types } from "mongoose";
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";
import Session from "../models/SessionModel.js";
import User from "../models/userModel.js";
import path from "path";
import { rm } from "fs/promises";

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const session = await mongoose.startSession();

  try {
    const userFound = await User.findOne({ email }).lean();
    if (userFound)
      return res.status(400).json({
        error: "User already exists",
        message: "Failed to create user",
      });

    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    session.startTransaction();
    await Directory.create(
      [
        {
          _id: rootDirId,
          name: `root-${email}`,
          userId,
          parentDirId: null,
        },
      ],
      { session }
    );

    await User.create(
      [
        {
          _id: userId,
          name,
          password,
          email,
          rootDirId,
        },
      ],
      { session }
    );

    session.commitTransaction();
    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    session.abortTransaction();
    if (error?.errorResponse?.code === 121)
      res.status(400).json({
        error:
          "1) Email must be valid. 2) Name & Password Must be atleast 3 Characters long.",
      });
    else next(error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      error: "All fields are required",
    });

  const user = await User.findOne({ email });

  if (user.isDeleted) {
    return res
      .status(403)
      .json({ message: "User account is deactivated or deleted." });
  }

  if (!user.password) {
    return res
      .status(403)
      .json({ message: "User account is created using google." });
  }

  if (!user || !user.comparePassword(password))
    return res.status(404).json({
      message: "Invalid Credentials",
    });

  const userSessions = await Session.find({ userId: user._id });
  if (userSessions.length >= 2) {
    let smallestValue = Infinity;
    userSessions.forEach((session) => {
      if (session.createdAt < smallestValue) {
        smallestValue = session.createdAt;
      }
    });
    await Session.deleteOne({ createdAt: smallestValue });
  }
  const session = await Session.create({ userId: user._id });

  res.cookie("token", session._id, {
    httpOnly: true,
    signed: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    message: "Logged In",
  });
};

export const getUserInfo = (req, res) => {
  res.status(200).json({
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
    role: req.user.role,
  });
};

export const logoutUser = async (req, res) => {
  const { token } = req.signedCookies;
  await Session.deleteOne({ userId: req.user._id, _id: token });
  res.clearCookie("token");
  res.status(204).end();
};

export const logoutAll = async (req, res) => {
  await Session.deleteMany({ userId: req.user._id });
  res.status(204).end();
};

export const getAllUsers = async (req, res) => {
  const currentUser = req.user;
  const AllUsers = await User.find()
    .select("name email picture role isDeleted")
    .lean();
  const sessions = await Session.find().select("userId").lean();
  const sessionUserIds = new Set(sessions.map((s) => s.userId.toString()));

  const nonDeletedUsers = AllUsers.filter((user) => !user.isDeleted);
  const Users = nonDeletedUsers
    .filter((user) => user._id.toString() !== currentUser._id.toString())
    .map((user) => {
      return {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        isLoggedIn: sessionUserIds.has(user._id.toString()),
      };
    });
  res.json({ Users, currentUser });
};

export const logoutSpecificUser = async (req, res) => {
  const currentUser = req.user;
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("role").lean();

  // Manager cannot logout admin.
  if (currentUser.role === "Manager" && user.role === "Admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to make this action" });
  }

  await Session.deleteMany({ userId });
  res.status(204).end();
};

export const DeleteSpecificUser = async (req, res) => {
  const currentUser = req.user;
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId }).select("role");

  // User cannot delete itself.
  if (currentUser._id.toString() === user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete your self" });
  }

  // Manager cannot delete Admin user.
  if (currentUser.role === "Manager" && user.role === "Admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to make this action" });
  }

  // Deleting all sessions of the user
  await Session.deleteMany({ userId });

  // Soft deleting user.
  user.isDeleted = true;
  await user.save();

  res.status(204).end();
};
