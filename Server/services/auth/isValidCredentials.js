import { StatusCodes } from "http-status-codes";
import User from "../../models/userModel.js";
import CustomError from "../../utils/ErrorResponse.js";

export const isValidCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError(
      "Invalid email or password",
      StatusCodes.UNAUTHORIZED
    );
  }

  if (!(await user.comparePassword(password))) {
    throw new CustomError(
      "Invalid email or password",
      StatusCodes.UNAUTHORIZED
    );
  }

  return user;
};
