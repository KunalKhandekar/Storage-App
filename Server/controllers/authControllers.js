import mongoose, { Types } from "mongoose";
import redisClient from "../config/redis.js";
import Directory from "../models/dirModel.js";
import User from "../models/userModel.js";
import {
  connectGoogleDrive,
  verifyGoogleCode,
} from "../services/googleService.js";
import CustomError from "../utils/ErrorResponse.js";
import { StatusCodes } from "http-status-codes";
import CustomSuccess from "../utils/SuccessResponse.js";
import githubClient from "../services/githubAuthService.js";
import { createSessionAndSetCookie } from "../utils/CreateSession.js";

export const loginWithGoogle = async (req, res, next) => {
  const code = req.body.code;
  const mongooseSession = await mongoose.startSession();
  let transactionStarted = false;

  try {
    const userData = await verifyGoogleCode(code);
    const { email, name, picture } = userData;
    const userFound = await User.findOne({ email });

    if (userFound) {
      if (userFound.isDeleted) {
        throw new CustomError(
          "This account has been deactivated or deleted. Please contact support for recovery.",
          StatusCodes.FORBIDDEN
        );
      }

      if (
        userFound.createdWith !== "email" &&
        userFound.createdWith !== "google"
      ) {
        throw new CustomError(
          `This email is already registered using ${userFound.createdWith}. Please login with ${userFound.createdWith}.`,
          StatusCodes.FORBIDDEN
        );
      }

      if (userFound.createdWith === "email") {
        userFound.createdWith = "google";
        await userFound.save();
      }

      if (userFound.picture.includes("api.dicebear.com")) {
        userFound.picture = picture;
        await userFound.save();
      }

      // Session limiting
      const userSessions = await redisClient.ft.search(
        "userIdIdx",
        `@userId:{${userFound._id}}`,
        { RETURN: [] }
      );

      if (userSessions.total >= 2) {
        const loginToken = crypto.randomUUID();
        await redisClient.set(
          `temp_login_token:${loginToken}`,
          JSON.stringify({
            userId: userFound._id,
          }),
          { EX: 300 }
        );
        throw new CustomError("Session Limit Exceed", StatusCodes.CONFLICT, {
          details: {
            sessionLimitExceed: true,
            temp_token: loginToken,
          },
        });
      }

      await createSessionAndSetCookie(userFound._id, res);

      return CustomSuccess.send(
        res,
        "Logged in with Google successfully.",
        StatusCodes.OK
      );
    }

    // Register new Google user
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    mongooseSession.startTransaction();
    transactionStarted = true;

    await Directory.create(
      [{ _id: rootDirId, name: `root-${email}`, userId, parentDirId: null }],
      { session: mongooseSession }
    );
    await User.create(
      [
        {
          _id: userId,
          name,
          picture,
          email,
          rootDirId,
          canLoginWithPassword: false,
          createdWith: "google",
        },
      ],
      {
        session: mongooseSession,
      }
    );

    const sessionID = crypto.randomUUID();
    const sessionExpiry = 7 * 24 * 60 * 60 * 1000;
    await redisClient.json.set(`session:${sessionID}`, "$", { userId });
    await redisClient.expire(`session:${sessionID}`, sessionExpiry / 1000);
    res.cookie("token", sessionID, {
      httpOnly: true,
      signed: true,
      maxAge: sessionExpiry,
    });

    await mongooseSession.commitTransaction();
    return CustomSuccess.send(
      res,
      "New account created with Google and logged in.",
      StatusCodes.OK
    );
  } catch (error) {
    if (transactionStarted) await mongooseSession.abortTransaction();
    next(error);
  } finally {
    mongooseSession.endSession();
  }
};

export const redirectToAuthURL = async (req, res, next) => {
  const { state, url } = githubClient.getWebFlowAuthorizationUrl({
    scopes: ["read:user", "user:email"],
    redirectUrl: `${process.env.BASE_URL}/auth/github/callback`,
  });

  res.cookie("_github_state", state, {
    httpOnly: true,
    signed: true,
    maxAge: 1000 * 60 * 10,
  });

  res.redirect(url);
};

export const loginWithGithub = async (req, res, next) => {
  const { _github_state } = req.signedCookies;
  const { code, state } = req.query;

  if (!_github_state || !code || !state || _github_state !== state) {
    return res.redirect(
      `${process.env.CLIENT_URL}/auth/error?message=${encodeURIComponent("GitHub login failed: Invalid state or missing code.")}`
    );
  }

  const mongooseSession = await mongoose.startSession();
  let transactionStarted = false;

  try {
    const { email, name, picture } = await githubClient.getUserDetails(code);
    if (!email) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/error?message=${encodeURIComponent("Your GitHub email is not verified. Please verify and try again.")}`
      );
    }

    const userFound = await User.findOne({ email });

    if (userFound) {
      if (userFound.isDeleted) {
        return res.redirect(
          `${process.env.CLIENT_URL}/auth/error?message=${encodeURIComponent("This account is deactivated. Contact support.")}`
        );
      }

      if (
        userFound.createdWith !== "email" &&
        userFound.createdWith !== "github"
      ) {
        return res.redirect(
          `${process.env.CLIENT_URL}/auth/error?message=${encodeURIComponent("This email is already registered with another method. Please login with your original provider.")}`
        );
      }

      if (userFound.createdWith === "email") {
        userFound.createdWith = "github";
        await userFound.save();
      }

      if (userFound.picture.includes("api.dicebear.com")) {
        userFound.picture = picture;
        await userFound.save();
      }

      const userSessions = await redisClient.ft.search(
        "userIdIdx",
        `@userId:{${userFound._id}}`,
        { RETURN: [] }
      );
      if (userSessions.total >= 2) {
        const loginToken = crypto.randomUUID();
        await redisClient.set(
          `temp_login_token:${loginToken}`,
          JSON.stringify({
            userId: userFound._id,
          }),
          { EX: 300 }
        );
        throw new CustomError("Session Limit Exceed", StatusCodes.CONFLICT, {
          details: {
            sessionLimitExceed: true,
            temp_token: loginToken,
          },
        });
      }

      await createSessionAndSetCookie(userFound._id, res);

      return res.redirect(`${process.env.CLIENT_URL}/`);
    }

    // Register new GitHub user
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    mongooseSession.startTransaction();
    transactionStarted = true;

    await Directory.create(
      [{ _id: rootDirId, name: `root-${email}`, userId, parentDirId: null }],
      { session: mongooseSession }
    );
    await User.create(
      [
        {
          _id: userId,
          name,
          picture,
          email,
          rootDirId,
          canLoginWithPassword: false,
          createdWith: "github",
        },
      ],
      {
        session: mongooseSession,
      }
    );

    const sessionID = crypto.randomUUID();
    const sessionExpiry = 7 * 24 * 60 * 60 * 1000;
    await redisClient.json.set(`session:${sessionID}`, "$", { userId });
    await redisClient.expire(`session:${sessionID}`, sessionExpiry / 1000);
    res.cookie("token", sessionID, {
      httpOnly: true,
      signed: true,
      maxAge: sessionExpiry,
    });

    await mongooseSession.commitTransaction();

    res.redirect(`${process.env.CLIENT_URL}/`);
  } catch (error) {
    if (transactionStarted) await mongooseSession.abortTransaction();
    return res.redirect(
      `${process.env.CLIENT_URL}/auth/error?message=${encodeURIComponent("GitHub login failed. Please try again later or contact support.")}`
    );
  } finally {
    mongooseSession.endSession();
  }
};

export const connectToDrive = async (req, res, next) => {
  const code = req.body.code;
  try {
    const files = await connectGoogleDrive(code, req.user);
    return CustomSuccess.send(res, "Files imported", StatusCodes.OK, {
      files,
    });
  } catch (error) {
    next(error);
  }
};

export const getDriveProgress = async (req, res) => {
  const data = await redisClient.hGetAll(`drive-sync:${req.user._id}`);
  if (!data || !data.total) {
    return res.status(404).json({ message: "Progress not found" });
  }
  const total = parseInt(data.total || "1", 10);
  const downloaded = parseInt(data.downloaded || "0", 10);
  const percentage = Math.round((downloaded / total) * 100);
  return CustomSuccess.send(res, null, StatusCodes.OK, {
    total,
    downloaded,
    percentage,
  });
};

export const DeleteAndCreateSession = async (req, res, next) => {
  const { temp_token } = req.body;
  try {
    if (!temp_token) {
      throw new CustomError("Login token not found.", StatusCodes.BAD_REQUEST);
    }

    const isTokenStored = await redisClient.get(
      `temp_login_token:${temp_token}`
    );

    if (!isTokenStored) {
      throw new CustomError("Token is Invalid/Expired");
    }

    const { userId } = JSON.parse(isTokenStored);

    const userSessions = await redisClient.ft.search(
      "userIdIdx",
      `@userId:{${userId}}`,
      {
        RETURN: [],
      }
    );

    if (userSessions.total >= 2) {
      await redisClient.del(userSessions.documents[0].id);
    }

    await createSessionAndSetCookie(userId, res);

    await redisClient.del(`temp_login_token:${temp_token}`);

    return CustomSuccess.send(res, "Session Created", StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};
