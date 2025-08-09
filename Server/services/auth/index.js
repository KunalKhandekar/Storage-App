import { deleteOldRedisSession } from "./deleteOldRedisSession.js";
import { parseTempToken } from "./parseTempToken.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../../utils/ErrorResponse.js";
import githubClient from "../auth/githubAuthService.js";
import { verifyGoogleCode } from "../auth/googleService.js";
import { findAndValidateOAuthUser } from "./findAndValidateOAuthUser.js";
import { handleExistingUser } from "./handleExistingUser.js";
import { registerNewOAuthUser } from "./registerNewOAuthUser.js";
import { checkSessionLimit } from "./checkSessionLimit.js";
import { createRedisSession } from "./createRedisSession.js";
import { isValidCredentials } from "./isValidCredentials.js";
import mongoose from "mongoose";
import { createUserWithRootDir } from "./createUserWithRootDir.js";
import { isValidOTP } from "./isValidOTP.js";
import { userExists } from "./userExists.js";

const registerUserService = async (data) => {
  const session = await mongoose.startSession();
  let transactionStarted = false;

  try {
    const { email, name, password, otp } = data;

    await userExists(email);
    await isValidOTP(email, otp);

    session.startTransaction();
    transactionStarted = true;

    await createUserWithRootDir(name, email, true, "email", session, password);
    await session.commitTransaction();
  } catch (error) {
    if (transactionStarted) await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const loginUserService = async (data) => {
  try {
    const { email, password, otp } = data;

    const user = await isValidCredentials(email, password);
    await isValidOTP(email, otp);

    await checkSessionLimit(user._id);

    const sessionInfo = await createRedisSession(user._id);

    return sessionInfo;
  } catch (error) {
    throw error;
  }
};

const loginWithGoogleService = async (code) => {
  const mongooseSession = await mongoose.startSession();
  let transactionStarted = false;
  try {
    const { email, name, picture } = await verifyGoogleCode(code);

    const existingUser = await findAndValidateOAuthUser(
      "google",
      email,
      picture
    );

    if (existingUser) {
      return await handleExistingUser(existingUser._id);
    }

    mongooseSession.startTransaction();
    transactionStarted = true;

    const sessionInfo = await registerNewOAuthUser(
      "google",
      name,
      email,
      picture,
      mongooseSession
    );
    await mongooseSession.commitTransaction();

    return sessionInfo;
  } catch (error) {
    if (transactionStarted) await mongooseSession.abortTransaction();
    throw error;
  } finally {
    mongooseSession.endSession();
  }
};

const loginWithGitHubService = async (_github_state, code, state) => {
  if (!_github_state || !code || !state || _github_state !== state) {
    throw new CustomError(
      "GitHub login failed: Invalid state or missing code.",
      StatusCodes.NOT_FOUND
    );
  }

  const mongooseSession = await mongoose.startSession();
  let transactionStarted = false;

  try {
    const { email, name, picture } = await githubClient.getUserDetails(code);
    if (!email) {
      throw new CustomError(
        "Your GitHub email is not verified. Please verify and try again",
        StatusCodes.NOT_FOUND
      );
    }

    const existingUser = await findAndValidateOAuthUser(
      "github",
      email,
      picture
    );

    if (existingUser) {
      return await handleExistingUser(existingUser._id);
    }

    mongooseSession.startTransaction();
    transactionStarted = true;

    const sessionInfo = await registerNewOAuthUser(
      "github",
      name,
      email,
      picture,
      mongooseSession
    );
    await mongooseSession.commitTransaction();
    return sessionInfo;
  } catch (error) {
    throw error;
  }
};

const refreshUserSessionService = async (temp_token) => {
  if (!temp_token) {
    throw new CustomError("Login token not found.", StatusCodes.BAD_REQUEST);
  }

  const userId = await parseTempToken(temp_token);

  await deleteOldRedisSession(userId);
  return await createRedisSession(userId);
};

export default {
  RegisterUserService: registerUserService,
  LoginUserService: loginUserService,
  LoginWithGoogleService: loginWithGoogleService,
  LoginWithGitHubService: loginWithGitHubService,
  RefreshUserSessionService: refreshUserSessionService,
};
