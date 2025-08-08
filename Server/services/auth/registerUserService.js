import mongoose from "mongoose";
import { createUserWithRootDir } from "./createUserWithRootDir.js";
import { isValidOTP } from "./isValidOTP.js";
import { userExists } from "./userExists.js";

export const registerUserService = async (data) => {
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
