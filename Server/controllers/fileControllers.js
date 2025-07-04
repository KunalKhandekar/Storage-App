import { rm } from "fs/promises";
import path from "path";
import { absolutePath } from "../app.js";
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";
import CustomError from "../utils/ErrorResponse.js";
import { StatusCodes } from "http-status-codes";
import CustomSuccess from "../utils/SuccessResponse.js";

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("No files uploaded", StatusCodes.BAD_REQUEST);
    }

    const { originalname, storedName } = req.file;
    const parentDirId = req.headers.parentdirid || req.user.rootDirId;

    const parentDirectory = await Directory.findOne({
      _id: parentDirId,
      userId: req.user._id,
    }).lean();

    if (!parentDirectory) {
      await rm(path.join(absolutePath, storedName));
      throw new CustomError(
        "You are not authorized to make this action",
        StatusCodes.UNAUTHORIZED
      );
    }

    await File.create({
      storedName,
      userId: req.user._id,
      name: originalname,
      parentDirId: parentDirectory._id,
    });

    return CustomSuccess.send(res, "File uploaded", StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

export const getFileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fileObj = await File.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!fileObj) {
      throw new CustomError("File not found", StatusCodes.NOT_FOUND);
    }

    const filePath = path.join(absolutePath, fileObj.storedName);

    if (req.query.action === "download") {
      return res.download(filePath, fileObj.name);
    }

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

export const renameFile = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const fileObj = await File.findOne({
    _id: id,
    userId: req.user._id,
  }).lean();

  if (!fileObj) {
    throw new CustomError("File not found", StatusCodes.NOT_FOUND);
  }

  try {
    await File.updateOne({ _id: fileObj._id }, { $set: { name } }).lean();
    return CustomSuccess.send(res, "File renamed", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  const { id } = req.params;

  const fileObj = await File.findOne({
    _id: id,
    userId: req.user._id,
  });

  if (!fileObj) {
    throw new CustomError("File not found", StatusCodes.NOT_FOUND);
  }

  try {
    await File.deleteOne({ _id: fileObj._id });
    await rm(path.join(absolutePath, fileObj.storedName));
    return CustomSuccess.send(res, "File deleted", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};
