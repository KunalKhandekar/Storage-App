import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/ErrorResponse.js";
import File from "../models/fileModel.js";

export const checkFileAccess = async (req, _, next) => {
  const { fileId } = req.params;
  try {
    const file = await File.findById(fileId).populate("sharedWith.userId");
    if (!file) {
      throw new CustomError("File not found", StatusCodes.NOT_FOUND);
    }

    if (!file.userId.equals(req.user._id)) {
      throw new CustomError(
        "You're not the owner of this file, action not allowed.",
        StatusCodes.UNAUTHORIZED
      );
    }
    req.file = file;
    next();
  } catch (error) {
    next(error);
  }
};
