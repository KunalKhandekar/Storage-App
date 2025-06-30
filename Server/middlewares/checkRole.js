import { ReasonPhrases, StatusCodes } from "http-status-codes";
import CustomError from "../utils/ErrorResponse.js";

export const checkRole = (req, res, next) => {
  if (req.user.role !== "User") return next();

  throw new CustomError("You're not authorized to make this action", StatusCodes.UNAUTHORIZED);
};
