import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/ErrorResponse.js";

export const checkRole = (req, _, next) => {
  const { role } = req.user;

  if (!["Manager", "Admin", "SuperAdmin"].includes(role)) {
    throw new CustomError(
      "You're not authorized to make this action",
      StatusCodes.UNAUTHORIZED
    );
  }

  next();
};
