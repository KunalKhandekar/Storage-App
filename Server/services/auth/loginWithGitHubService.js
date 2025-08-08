import { StatusCodes } from "http-status-codes";
import CustomError from "../../utils/ErrorResponse.js";
import githubClient from "../githubAuthService.js";
import { findAndValidateOAuthUser } from "./findAndValidateOAuthUser.js";
import { handleExistingUser } from "./handleExistingUser.js";
import { registerNewOAuthUser } from "./registerNewOAuthUser.js";
import mongoose from "mongoose";

export const loginWithGitHubService = async (_github_state, code, state) => {
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
