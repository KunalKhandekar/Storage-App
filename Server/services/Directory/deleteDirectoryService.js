import path from "path";
import { rm } from "fs/promises";
import CustomError from "../../utils/ErrorResponse.js";
import { StatusCodes } from "http-status-codes";
import { absolutePath } from "../../app.js";
import Directory from "../../models/dirModel.js";
import File from "../../models/fileModel.js";

// Recursively finds all child directories & files under a given directory
const collectDirectoryContents = async (dirId) => {
  let directories = await Directory.find(
    { parentDirId: dirId },
    { projection: { _id: 1 } }
  ).lean();

  let files = await File.find({ parentDirId: dirId })
    .select("storedName googleFileId")
    .lean();

  for (const { _id } of directories) {
    const { directories: childDirs, files: childFiles } =
      await collectDirectoryContents(_id);

    files = [...files, ...childFiles];
    directories = [...directories, ...childDirs];
  }

  return { directories, files };
};

export const deleteDirectoryService = async (dirId, userId) => {
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
