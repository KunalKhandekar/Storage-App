import { rm } from "fs/promises";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { uuidv4 } from "zod/v4";
import { absolutePath } from "../app.js";
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import CustomError from "../utils/ErrorResponse.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import {
  sharedByMeFiles,
  sharedWithMeFiles,
} from "../services/shareService.js";

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

    req.file = fileObj;

    next();
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
    if (!fileObj.googleFileId) {
      await rm(path.join(absolutePath, fileObj.storedName));
    }
    return CustomSuccess.send(res, "File deleted", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

// Share File Controllers
// route -> /file/share/:fileId/email
export const shareViaEmail = async (req, res, next) => {
  const file = req.file;
  const { users } = req.body;

  try {
    let response = [];
    for (const { email, name, permission } of users) {
      const user = await User.findOne({ email }).lean();

      if (!user) {
        response.push(
          `${name} -> ${email} is not registered, file cannot be shared.`
        );
        continue;
      }

      const alreadyShared = file.sharedWith.find(
        (u) => u.userId.toString() === user._id.toString()
      );

      if (alreadyShared) {
        response.push(`${name} -> File already shared with ${email}.`);
        continue;
      }

      file.sharedWith.push({
        permission,
        userId: user._id,
      });
    }
    await file.save();

    return CustomSuccess.send(
      res,
      "File Shared with selected user.",
      StatusCodes.OK,
      { response }
    );
  } catch (error) {
    next(error);
  }
};

export const shareViaLink = async (req, res, next) => {
  const file = req.file;
  const { permission } = req.body;
  try {
    if (file.sharedViaLink.token) {
      return CustomSuccess.send(
        res,
        "Link generated for file.",
        StatusCodes.OK,
        {
          link: `${process.env.CLIENT_URL}/guest/access/${file._id}?token=${file.sharedViaLink.token}`,
          permission: file.sharedViaLink.permission,
          enabled: file.sharedViaLink.enabled,
        }
      );
    }

    file.sharedViaLink = {
      enabled: false,
      permission,
      token: crypto.randomUUID(),
    };

    await file.save();

    return CustomSuccess.send(res, "Link generated for file.", StatusCodes.OK, {
      link: `${process.env.CLIENT_URL}/guest/access/${file._id}?token=${file.sharedViaLink.token}`,
      permission: file.sharedViaLink.permission,
      enabled: file.sharedViaLink.enabled,
    });
  } catch (error) {
    next(error);
  }
};

export const shareLinkToggle = async (req, res, next) => {
  const file = req.file;
  const { enabled } = req.body;
  try {
    file.sharedViaLink.enabled = enabled;
    await file.save();

    return CustomSuccess.send(res, null, StatusCodes.OK, {
      permission: file.sharedViaLink.permission,
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedFileViaLink = async (req, res, next) => {
  const { fileId } = req.params;
  const { token } = req.query;
  try {
    const file = await File.findById(fileId).lean();
    if (!file) {
      throw new CustomError("File not found", StatusCodes.NOT_FOUND);
    }

    if (!file.sharedViaLink.enabled) {
      throw new CustomError(
        "File access has been disabled by the user.",
        StatusCodes.CONFLICT
      );
    }

    if (file.sharedViaLink.token !== token) {
      throw new CustomError(
        "File Access token is Invalid",
        StatusCodes.CONFLICT
      );
    }

    req.file = file;
    next();
  } catch (error) {
    next(error);
  }
};

export const getFileInfoAndURL = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.fileId)
      .select("name sharedViaLink userId")
      .populate("userId");

    const url = `${process.env.BASE_URL}/guest/file/view/${file._id}?token=${file.sharedViaLink.token}`;

    return CustomSuccess.send(res, null, StatusCodes.OK, {
      url,
      name: file.name,
      sharedBy: file.userId.name,
      isAccessible: file.sharedViaLink.enabled,
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedFileViaEmail = async (req, res, next) => {
  const { fileId } = req.params;
  try {
    const file = await File.findById(fileId).lean();
    if (!file) {
      throw new CustomError("File not found", StatusCodes.NOT_FOUND);
    }
    
    const hasAccess = file.sharedWith.find((u) =>
      u.userId.equals(req.user._id)
    );

    if (!hasAccess) {
      throw new CustomError(
        "You are not authorized to access this file.",
        StatusCodes.UNAUTHORIZED
      );
    }

    req.file = file;

    next();
  } catch (error) {
    next(error);
  }
};

export const changePermission = async (req, res, next) => {
  const file = req.file;
  const { permission } = req.body;
  try {
    file.sharedViaLink.permission = permission;
    await file.save();

    return CustomSuccess.send(res, null, StatusCodes.OK, {
      permission: file.sharedViaLink.permission,
    });
  } catch (error) {
    next(error);
  }
};

export const changePermissionOfUser = async (req, res, next) => {
  const file = req.file;
  const { permission } = req.body;
  const { userId } = req.params;
  try {

    // Checking if the given user exist in the shared list.
    const collaborator = file.sharedWith.find(
      (c) => c.userId._id.toString() === userId
    );
    if (!collaborator) {
      throw new CustomError(
        "File is not shared with the selected user.",
        StatusCodes.CONFLICT
      );
    }

    collaborator.permission = permission;
    await file.save();

    return CustomSuccess.send(
      res,
      "SuccessFully Updated the permission.",
      StatusCodes.OK,
      { permission: collaborator.permission }
    );
  } catch (error) {
    next(error);
  }
};

export const revokeUserAccess = async (req, res, next) => {
  const { userId } = req.params;
  const file = req.file;
  try {
    // Checking if the given user exist in the list.
    const collaborator = file.sharedWith.find(
      (c) => c.userId._id.toString() === userId
    );
    if (!collaborator) {
      throw new CustomError(
        "File is not shared with the selected user.",
        StatusCodes.CONFLICT
      );
    }

    file.sharedWith = file.sharedWith.filter(
      (c) => c.userId._id.toString() !== userId
    );
    await file.save();

    return CustomSuccess.send(
      res,
      "SuccessFully removed the user.",
      StatusCodes.OK
    );
  } catch (error) {
    next(error);
  }
};

export const getUserAccessList = async (req, res, next) => {
  const file = req.file;
  try {
    const sharedUsers =
      (
        await File.findById(file._id)
          .populate("sharedWith.userId", "name email picture")
          .select("sharedWith.userId sharedWith.permission sharedWith.sharedAt")
          .lean()
      )?.sharedWith || [];

    const allUsers = (
      await User.find().select("name email picture").lean()
    ).filter((u) => !req.user._id.equals(u._id));

    const sharedUserIdArray = sharedUsers.map((u) => u.userId._id.toString());

    const availableUsers = allUsers.filter(
      (u) => !sharedUserIdArray.includes(u._id.toString())
    );

    return CustomSuccess.send(res, null, StatusCodes.OK, {
      sharedUsers,
      availableUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardInfo = async (req, res, next) => {
  const currentUser = req.user;
  try {
    let sharedByMe = await sharedByMeFiles(currentUser._id) || [];
    sharedByMe = sharedByMe.map((f) => ({
      ...f,
      type: "sharedByMe",
    }));

    let sharedWithMe = await sharedWithMeFiles(currentUser._id) || [];
    sharedWithMe = sharedWithMe.map((f) => ({
      ...f,
      type: "sharedWithMe",
      latestTime: new Date(f.updatedAt || 0),
    }));

    const collaborators = new Set([
      ...sharedWithMe.map((file) => file?.userId?._id.toString()),
      ...sharedByMe.flatMap((file) =>
        file?.sharedWith?.map((u) => u?.userId?._id.toString())
      ),
    ]);

    const recentFiles = [...sharedByMe, ...sharedWithMe]
      .sort((a, b) => new Date(b.latestTime) - new Date(a.latestTime))
      .slice(0, 5);

    return CustomSuccess.send(res, null, StatusCodes.OK, {
      sharedByMeLength: sharedByMe.length,
      sharedWithMeLength: sharedWithMe.length,
      collaborators: collaborators.size,
      recentFiles: recentFiles.map((file) => {
        return {
          _id: file._id,
          name: file.name,
          isSharedViaLink: file?.sharedViaLink?.enabled,
          shareViaLink: file?.sharedViaLink,
          sharedWith: file?.sharedWith?.map((u) => {
            return {
              user: {
                _id: u.userId?._id,
                name: u.userId?.name,
                email: u.userId?.email,
                picture: u.userId?.picture,
              },
              permission: u.permission,
              sharedAt: u.sharedAt,
            };
          }),
          permission: file.sharedWith?.find((u) =>
            u?.userId?._id.equals(currentUser._id)
          )?.permission,
          sharedBy: {
            _id: file.userId?._id,
            name: file.userId?.name,
            email: file.userId?.email,
            picture: file.userId?.picture,
          },
          latestTime: new Date(file.updatedAt),
          type: file.type,
          fileType: path.extname(file.name),
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const getFileInfoById = async (req, res, next) => {
  const file = req.file;

  try {
    return CustomSuccess.send(res, null, StatusCodes.OK, {
      fileInfo: {
        ...file._doc,
        fileType: path.extname(file.name),
        size: "2 MB",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedByMeFiles = async (req, res, next) => {
  const currentUser = req.user;
  try {
    return CustomSuccess.send(res, null, StatusCodes.OK, {
      sharedByMeFiles: (await sharedByMeFiles(currentUser._id)).map((file) => {
        return {
          _id: file._id,
          name: file.name,
          isSharedViaLink: file.sharedViaLink?.enabled,
          shareViaLink: file.sharedViaLink,
          sharedWith: file.sharedWith.map((u) => {
            return {
              user: {
                _id: u.userId?._id,
                name: u.userId?.name,
                email: u.userId?.email,
                picture: u.userId?.picture,
              },
              permission: u.permission,
              sharedAt: u.sharedAt,
            };
          }),
          latestTime: file.latestTime,
          type: "sharedByMe",
          fileType: path.extname(file.name),
          size: "2 MB",
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedWithMeFiles = async (req, res, next) => {
  const currentUser = req.user;
  try {
    return CustomSuccess.send(res, null, StatusCodes.OK, {
      sharedWithMe: (await sharedWithMeFiles(currentUser._id)).map((file) => {
        return {
          _id: file._id,
          name: file.name,
          permission: file.sharedWith.find((u) =>
            u.userId._id.equals(currentUser._id)
          ).permission,
          sharedBy: {
            _id: file.userId?._id,
            name: file.userId?.name,
            email: file.userId?.email,
            picture: file.userId?.picture,
          },
          latestTime: new Date(file.updatedAt),
          fileType: path.extname(file.name),
          size: "2 MB",
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const renameFileByEditor = async (req, res, next) => {
  const file = req.file;
  const { name } = req.body;
  try {
    file.name = name;
    await file.save();
    return CustomSuccess.send(res, null, StatusCodes.OK, { name: file.name });
  } catch (error) {
    next(error);
  }
};
