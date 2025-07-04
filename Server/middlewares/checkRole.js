import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/ErrorResponse.js";

export const checkRole = (req, res, next) => {
  const { role } = req.user;
  if (["Manager", "Admin", "SuperAdmin"].includes(role)) {
    next();
  }

  throw new CustomError(
    "You're not authorized to make this action",
    StatusCodes.UNAUTHORIZED
  );
};
