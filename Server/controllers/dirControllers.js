import { StatusCodes } from "http-status-codes";
import { DirectoryServices } from "../services/index.js";
import CustomSuccess from "../utils/SuccessResponse.js";

export const getDir = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const directoryData = await DirectoryServices.GetDirectoryDataService(
      userId,
      id
    );

    return CustomSuccess.send(res, null, StatusCodes.OK, directoryData);
  } catch (error) {
    next(error);
  }
};

export const updateDir = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { name } = req.body;
  try {
    await DirectoryServices.UpdateDirectoryDataService(userId, id, name);
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
    const directory = await DirectoryServices.CreateDirectoryService(
      parentDirId,
      user._id,
      dirname
    );
    return CustomSuccess.send(
      res,
      "Directory created",
      StatusCodes.OK,
      directory
    );
  } catch (error) {
    next(error);
  }
};

export const deleteDir = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    await DirectoryServices.DeleteDirectoryService(id, userId);
    return CustomSuccess.send(res, "Directory deleted", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};
