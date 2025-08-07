import { StatusCodes } from "http-status-codes";
import User from "../../models/userModel.js";
import CustomError from "../../utils/ErrorResponse.js";

export const userExists = async (email) => {
  const userFound = await User.findOne({ email }).lean();
  if (userFound) {
    throw new CustomError("User already eixst", StatusCodes.CONFLICT);
  }
};
