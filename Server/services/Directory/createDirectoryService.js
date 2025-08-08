import { StatusCodes } from "http-status-codes";
import Directory from "../../models/dirModel.js";
import CustomError from "../../utils/ErrorResponse.js";

export const createDirectoryService = async (parentDirId, userId, dirname) => {
  try {
    const dirObj = await Directory.findOne({
      _id: parentDirId,
      userId,
    }).lean();

    if (!dirObj)
      throw new CustomError(
        "You are not authorized to make this action",
        StatusCodes.UNAUTHORIZED
      );
    const dir = new Directory({
      name: dirname,
      parentDirId,
      userId: dirObj.userId,
    });

    await dir.save();

    return dir;
  } catch (error) {
    throw error;
  }
};
