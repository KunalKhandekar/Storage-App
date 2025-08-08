import { StatusCodes } from "http-status-codes";
import Directory from "../../models/dirModel.js";
import CustomError from "../../utils/ErrorResponse.js";
import File from "../../models/fileModel.js";

export const getDirectoryDataService = async (userId, dirId = null) => {
  try {
    const directoryData = dirId
      ? await Directory.findOne({
          _id: dirId,
          userId,
        }).lean()
      : await Directory.findOne({
          userId,
          parentDirId: null,
        }).lean();

    if (!directoryData)
      throw new CustomError(
        "You are not authorized to make this action",
        StatusCodes.UNAUTHORIZED
      );

    const files = (
      await File.find({ parentDirId: directoryData?._id }).lean()
    ).map((file) => ({ ...file, type: "file" }));

    const directories = (
      await Directory.find({ parentDirId: directoryData?._id }).lean()
    ).map((dir) => ({ ...dir, type: "directory" }));

    return { ...directoryData, files, directory: directories };
  } catch (error) {
    throw error;
  }
};
