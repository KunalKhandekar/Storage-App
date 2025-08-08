import { StatusCodes } from "http-status-codes";
import mongoose, { Types } from "mongoose";
import redisClient from "../config/redis.js";
import Directory from "../models/dirModel.js";
import User from "../models/userModel.js";
import githubClient from "../services/githubAuthService.js";
import {
  connectGoogleDrive,
  verifyGoogleCode,
} from "../services/googleService.js";
import { AuthServices } from "../services/index.js";
import { createSessionAndSetCookie } from "../utils/CreateSession.js";
import CustomError from "../utils/ErrorResponse.js";
import { setCookie } from "../utils/setCookie.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { validateLoginInputs } from "../validators/validateLoginInputs.js";
import { validateRegisterInput } from "../validators/validateRegisterInputs.js";

export const registerUser = async (req, res, next) => {
  try {
    const parsedData = validateRegisterInput(req.body);
    await AuthServices.RegisterUserService(parsedData);
    return CustomSuccess.send(res, "User registered", StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const parsedData = validateLoginInputs(req.body);
    const { sessionID, sessionExpiry } = await AuthServices.LoginUserService(parsedData);
    setCookie(res, sessionID, sessionExpiry);
    return CustomSuccess.send(res, "Logged in successful", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const loginWithGoogle = async (req, res, next) => {
  const code = req.body.code;

  try {
    const { sessionExpiry, sessionID } = await AuthServices.LoginWithGoogleService(code) 
    setCookie(res, sessionID, sessionExpiry);
    return CustomSuccess.send(
      res,
      "Logged in Successfull",
      StatusCodes.OK
    );
  } catch (error) {
    next(error);
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
        return res.redirect(
          `${process.env.CLIENT_URL}/auth/error?temp_token=${encodeURIComponent(loginToken)}`
        );
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

    await createSessionAndSetCookie(userId, res);

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
