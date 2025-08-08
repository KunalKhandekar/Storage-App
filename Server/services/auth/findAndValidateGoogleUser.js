import { StatusCodes } from "http-status-codes";
import User from "../../models/userModel.js";
import CustomError from "../../utils/ErrorResponse.js";

export const findAndValidateGoogleUser = async (email, picture) => {
  const user = await User.findOne({ email });

  if (!user) return null;

  if (user.isDeleted) {
    throw new CustomError(
      "This account has been deactivated or deleted. Please contact support for recovery.",
      StatusCodes.FORBIDDEN
    );
  }

  if (user.createdWith !== "email" && user.createdWith !== "google") {
    throw new CustomError(
      `This email is already registered using ${user.createdWith}. Please login with ${user.createdWith}.`,
      StatusCodes.FORBIDDEN
    );
  }

  let updated = false;
  if (user.createdWith === "email") {
    user.createdWith = "google";
    updated = true;
  }

  if (user.picture?.includes("api.dicebear.com")) {
    user.picture = picture;
    updated = true;
  }

  if (updated) await user.save();
  
  return user;
};
