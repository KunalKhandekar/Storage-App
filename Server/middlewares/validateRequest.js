import { Types } from "mongoose";
import CustomError from "../utils/ErrorResponse.js";
import { StatusCodes } from "http-status-codes";

export default function validateRequest(req, res, next, id) {
  if (!Types.ObjectId.isValid(id)) {
    throw new CustomError(`Invalid ID: ${id}`, StatusCodes.CONFLICT);
  }

  next();
}
