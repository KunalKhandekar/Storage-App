import mongoose from "mongoose";
import { verifyGoogleCode } from "../googleService.js";
import { findAndValidateOAuthUser } from "./findAndValidateOAuthUser.js";
import { handleExistingUser } from "./handleExistingUser.js";
import { registerNewOAuthUser } from "./registerNewOAuthUser.js";

export const loginWithGoogleService = async (code) => {
  const mongooseSession = await mongoose.startSession();
  let transactionStarted = false;
  try {
    const { email, name, picture } = await verifyGoogleCode(code);

    const existingUser = await findAndValidateOAuthUser("google", email, picture);

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
