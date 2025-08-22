import { rm } from "fs/promises";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { absolutePath } from "../../app.js";
import Directory from "../../models/dirModel.js";
import File from "../../models/fileModel.js";
import CustomError from "../../utils/ErrorResponse.js";
import { collectDirectoryContents } from "./collectDirectoryContents.js";
import { updateParentDirectorySize } from "../file/index.js";
import mongoose from "mongoose";
import { generateBreadCrumb, generatePath } from "../../utils/generatePath.js";

const getDirectoryDataService = async (userId, dirId = null) => {
  try {
    const directoryData = dirId
      ? await Directory.findOne({
          _id: dirId,
          userId,
        })
          .populate("path")
          .lean()
      : await Directory.findOne({
          userId,
          parentDirId: null,
        })
          .populate("path")
          .lean();

    if (!directoryData)
      throw new CustomError(
        "You are not authorized to make this action",
        StatusCodes.UNAUTHORIZED
      );

    const files = (
      await File.find({ parentDirId: directoryData?._id }).lean()
    ).map((file) => ({
      ...file,
      ...{
        type: "file",
        path: generatePath([...directoryData.path, file]),
      },
    }));

    const childDirs = await Directory.find({
      parentDirId: directoryData?._id,
    }).lean();

    const directories = await Promise.all(
      childDirs.map(async (dir) => {
        const [fileCounts, dirCounts] = await Promise.all([
          await File.countDocuments({ parentDirId: dir._id }),
          await Directory.countDocuments({ parentDirId: dir._id }),
        ]);

        return {
          ...dir,
          ...{
            type: "directory",
            path: generatePath([...directoryData.path, dir]),
            files: fileCounts,
            directories: dirCounts,
          },
        };
      })
    );

    return { ...directoryData, files, directory: directories, breadCrumb: generateBreadCrumb([...directoryData.path]), };
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
    const parentDirectory = await Directory.findOne({
      _id: parentDirId,
      userId,
    }).lean();

    if (!parentDirectory)
      throw new CustomError(
        "You are not authorized to make this action",
        StatusCodes.UNAUTHORIZED
      );

    const newId = new mongoose.Types.ObjectId();
    const dir = new Directory({
      _id: newId,
      name: dirname,
      parentDirId,
      userId: parentDirectory.userId,
      path: [...(parentDirectory.path || []), newId],
    });

    await dir.save();

    return dir;
  } catch (error) {
    throw error;
  }
};

const deleteDirectoryService = async (dirId, userId) => {
  try {
    const dirObj = await Directory.findOne({ _id: dirId, userId })
      .select("_id parentDirId size")
      .lean();

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
    await updateParentDirectorySize(dirObj.parentDirId, -dirObj.size);
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
