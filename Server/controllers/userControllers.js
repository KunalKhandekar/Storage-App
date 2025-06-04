import mongoose, { Types } from "mongoose";
import Directory from "../models/dirModel.js";
import User from "../models/userModel.js";

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

  const user = await User.findOne({ email, password }).select("-password").lean();

  if (!user)
    return res.status(404).json({
      error: "Invalid Credentials",
    });

  res.cookie("uid", user._id.toString(), {
    httpOnly: true,
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
  });
};

export const logoutUser = (req, res) => {
  res.cookie("uid", {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    path: "/",
    expires: new Date(0),
  });
  res.status(204).end();
};
