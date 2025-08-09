import { rm } from "fs/promises";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { absolutePath } from "../../app.js";
import Directory from "../../models/dirModel.js";
import File from "../../models/fileModel.js";
import CustomError from "../../utils/ErrorResponse.js";
import { collectDirectoryContents } from "./collectDirectoryContents.js";

const getDirectoryDataService = async (userId, dirId = null) => {
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

export const updateDirectoryDataService = async (userId, dirId, name) => {
  try {
    await Directory.findOneAndUpdate(
      { _id: dirId, userId },
      { $set: { name } },
      { new: true, runValidators: true }
    );
  } catch (error) {
    throw error;
  }
};

const createDirectoryService = async (parentDirId, userId, dirname) => {
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

const deleteDirectoryService = async (dirId, userId) => {
  try {
    const dirObj = await Directory.findOne(
      { _id: dirId, userId },
      { projection: { _id: 1 } }
    ).lean();

    if (!dirObj) {
      throw new CustomError(
        "You are not authorized to make this action",
        StatusCodes.UNAUTHORIZED
      );
    }

    const { files, directories } = await collectDirectoryContents(dirId);

    const includeThisDir = [
      ...(directories?.map((dir) => dir._id) || []),
      dirId,
    ];

    await Directory.deleteMany({ _id: { $in: includeThisDir } });

    for (const file of files) {
      const { storedName, googleFileId } = file;
      if (!googleFileId) {
        await rm(path.join(absolutePath, storedName));
      }
    }

    await File.deleteMany({ _id: { $in: files?.map((file) => file._id) } });
  } catch (error) {
    throw error;
  }
};

export default {
  GetDirectoryDataService: getDirectoryDataService,
  UpdateDirectoryDataService: updateDirectoryDataService,
  CreateDirectoryService: createDirectoryService,
  DeleteDirectoryService: deleteDirectoryService,
};
