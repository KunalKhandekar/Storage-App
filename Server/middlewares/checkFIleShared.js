import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/ErrorResponse.js";
import File from "../models/fileModel.js";

export const checkFileShared = async (req, res, next) => {
  const { fileId } = req.params;
  try {
    const file = await File.findById(fileId).populate("sharedWith.userId");
    if (!file) {
      throw new CustomError("File not found", StatusCodes.NOT_FOUND);
    }


    const hasAccess = file.sharedWith.find((u) =>
      u.userId._id.equals(req.user._id)
    );

    // Don't have permission or the User is not the editor.
    if (!hasAccess || hasAccess.permission !== "editor") {
      throw new CustomError(
        "You don't have access to this file.",
        StatusCodes.UNAUTHORIZED
      );
    }

    req.file = file;
    next();
  } catch (error) {
    next(error);
  }
};
