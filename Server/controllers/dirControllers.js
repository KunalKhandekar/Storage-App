import { rm } from "node:fs/promises";
import path from "node:path";
import { absolutePath } from "../app.js";
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";
import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/ErrorResponse.js";
import CustomSuccess from "../utils/SuccessResponse.js";

export const getDir = async (req, res, next) => {
  const { id } = req.params;

  try {
    const directoryData = id
      ? await Directory.findOne({
          _id: id,
          userId: req.user._id,
        }).lean()
      : await Directory.findOne({
          userId: req.user._id,
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

    const directory = (
      await Directory.find({ parentDirId: directoryData?._id }).lean()
    ).map((dir) => ({ ...dir, type: "directory" }));

    return CustomSuccess.send(res, null, StatusCodes.OK, {
      ...directoryData,
      files,
      directory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDir = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const { name } = req.body;

  try {
    await Directory.findOneAndUpdate(
      { _id: id, userId: user._id },
      { $set: { name } },
      { new: true, runValidators: true }
    );

    return CustomSuccess.send(res, "Directory renamed", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const createDir = async (req, res, next) => {
  const user = req.user;
  const parentDirId = req.params.parentDirId || user.rootDirId;
  const { dirname } = req.headers;

  try {
    const dirObj = await Directory.findOne({
      _id: parentDirId,
      userId: req.user._id,
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
    return CustomSuccess.send(res, "Directory created", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const deleteDir = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  const deleteDirectory = async (id) => {
    let directories = await Directory.find(
      { parentDirId: id },
      { projection: { _id: 1 } }
    ).lean();

    let files = await File.find({ parentDirId: id })
      .select("storedName googleFileId")
      .lean();

    for (const { _id } of directories) {
      const { directories: childDirs, files: childFiles } =
        await deleteDirectory(_id);
      files = [...files, ...childFiles];
      directories = [...directories, ...childDirs];
    }

    return { directories, files };
  };

  try {
    const dirObj = await Directory.findOne(
      {
        _id: id,
        userId: user._id,
      },
      { projection: { _id: 1 } }
    ).lean();

    if (!dirObj)
      throw new CustomError(
        "You are not authorized to make this action",
        StatusCodes.UNAUTHORIZED
      );

    const { files, directories } = await deleteDirectory(id);

    const includeThisDir = [...(directories?.map((dir) => dir._id) || []), id];

    await Directory.deleteMany({ _id: { $in: includeThisDir } });

    for (const file of files) {
      const { storedName, googleFileId } = file;
      // Google file not stored in local storage.
      if (googleFileId) {
        continue;
      }
      await rm(path.join(absolutePath, storedName));
    }

    await File.deleteMany({ _id: { $in: files?.map((file) => file._id) } });

    return CustomSuccess.send(res, "Directory deleted", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};
