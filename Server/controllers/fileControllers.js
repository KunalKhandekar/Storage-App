import { StatusCodes } from "http-status-codes";
import path from "path";
import { sharedByMeFiles } from "../services/file/sharedByMeFiles.js";
import { sharedWithMeFiles } from "../services/file/sharedWithMeFiles.js";
import { FileServices } from "../services/index.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { validateInputs } from "../utils/ValidateInputs.js";
import {
  enabledSchema,
  nameSchema,
  permissionSchema,
} from "../validators/commonValidation.js";
import {
  initiateFileUploadSchema,
  shareViaEmailSchema,
} from "../validators/fileSchema.js";

export const uploadFile = async (req, res, next) => {
  const file = req.file;
  const parentDirId = req.headers.parentdirid || req.user.rootDirId;
  const userId = req.user._id;
  try {
    const newFile = await FileServices.UploadFileService(
      file,
      parentDirId,
      userId
    );

    return CustomSuccess.send(
      res,
      "File uploaded",
      StatusCodes.CREATED,
      newFile
    );
  } catch (error) {
    next(error);
  }
};

export const initiateFileUpload = async (req, res, next) => {
  const { rootDirId, _id, maxStorageLimit } = req.user;
  try {
    const { name, size, contentType, parentDirId } = validateInputs(
      initiateFileUploadSchema,
      req.body
    );

    const { uploadURL, newFileId } =
      await FileServices.UploadFileInitiateService(
        rootDirId,
        _id,
        maxStorageLimit,
        name,
        size,
        contentType,
        parentDirId
      );

    return CustomSuccess.send(res, "Upload initiated", StatusCodes.OK, {
      uploadURL,
      fileId: newFileId,
    });
  } catch (error) {
    next(error);
  }
};

export const completeFileUpload = async (req, res, next) => {
  const { fileId } = req.params;
  const userId = req.user._id;
  try {
    await FileServices.UploadFileCompleteService(fileId, userId);
    return CustomSuccess.send(res, "File uploaded", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const getFileById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const file = await FileServices.GetFileService(id, userId);
    req.file = file;
    next();
  } catch (error) {
    next(error);
  }
};

export const renameFile = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user._id;
  try {
    const sanitizedData = sanitizeInput(name);
    const parsedName = validateInputs(nameSchema, sanitizedData);
    const renamedFile = await FileServices.RenameFileService(
      id,
      userId,
      parsedName
    );
    return CustomSuccess.send(res, "File renamed", StatusCodes.OK, renamedFile);
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const deletedFile = await FileServices.DeleteFileService(id, userId);
    return CustomSuccess.send(res, "File deleted", StatusCodes.OK, deletedFile);
  } catch (error) {
    next(error);
  }
};

// Share File Controllers
export const shareViaEmail = async (req, res, next) => {
  const file = req.file;
  const { users } = req.body;
  try {
    const parsedUsers = validateInputs(shareViaEmailSchema, users);
    const response = await FileServices.ShareViaEmailService(parsedUsers, file);
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
    const parsedPermission = validateInputs(permissionSchema, permission);
    const linkInfo = await FileServices.ShareviaLinkService(
      file,
      parsedPermission
    );
    return CustomSuccess.send(
      res,
      "Link generated for file.",
      StatusCodes.OK,
      linkInfo
    );
  } catch (error) {
    next(error);
  }
};

export const shareLinkToggle = async (req, res, next) => {
  const file = req.file;
  const { enabled } = req.body;
  try {
    const parsedEnabled = validateInputs(enabledSchema, enabled);
    const permission = await FileServices.ShareLinkToggleService(
      file,
      parsedEnabled
    );
    return CustomSuccess.send(res, null, StatusCodes.OK, {
      permission,
      enabled,
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedFileViaLink = async (req, res, next) => {
  const { fileId } = req.params;
  const { token } = req.query;
  try {
    const file = await FileServices.GetSharedFileViaLinkService(fileId, token);
    req.file = file;
    next();
  } catch (error) {
    next(error);
  }
};

export const getFileInfoAndURL = async (req, res, next) => {
  const fileId = req.params.fileId;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  try {
    const fileInfo = await FileServices.GetFileInfoService(fileId, baseUrl);
    return CustomSuccess.send(res, null, StatusCodes.OK, fileInfo);
  } catch (error) {
    next(error);
  }
};

export const getSharedFileViaEmail = async (req, res, next) => {
  const { fileId } = req.params;
  const userId = req.user._id;
  try {
    const file = await FileServices.GetSharedFileViaEmailService(
      fileId,
      userId
    );
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
    const parsedPermission = validateInputs(permissionSchema, permission);
    const changedPermission =
      await FileServices.ChangeFileSharePermissionService(
        file,
        parsedPermission
      );
    return CustomSuccess.send(res, null, StatusCodes.OK, {
      permission: changedPermission,
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
    const parsedPermission = validateInputs(permissionSchema, permission);
    const changedPermission = await FileServices.ChangePermissionOfUserService(
      file,
      parsedPermission,
      userId
    );

    return CustomSuccess.send(
      res,
      "SuccessFully Updated the permission.",
      StatusCodes.OK,
      { permission: changedPermission }
    );
  } catch (error) {
    next(error);
  }
};

export const revokeUserAccess = async (req, res, next) => {
  const { userId } = req.params;
  const file = req.file;
  try {
    await FileServices.RevokeUserAccessService(file, userId);
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
  const userId = req.user._id;
  try {
    const { sharedUsers, availableUsers } =
      await FileServices.GetUserAccessListService(file._id, userId);
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
    let sharedByMe = (await sharedByMeFiles(currentUser._id)) || [];
    sharedByMe = sharedByMe.map((f) => ({
      ...f,
      type: "sharedByMe",
    }));

    let sharedWithMe = (await sharedWithMeFiles(currentUser._id)) || [];
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
        size: file.size,
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
          size: file.size,
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
          size: file.size,
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const renameFileSharedViaEmail = async (req, res, next) => {
  const file = req.file;
  const { name } = req.body;
  try {
    const sanitizedData = sanitizeInput(name);
    const parsedName = validateInputs(nameSchema, sanitizedData);
    const newFileName = await FileServices.RenameFileByEditorService(
      file,
      parsedName
    );
    return CustomSuccess.send(res, null, StatusCodes.OK, { name: newFileName });
  } catch (error) {
    next(error);
  }
};

export const renameFileSharedViaLink = async (req, res, next) => {
  const file = req.file;
  const { name } = req.body;
  try {
    const sanitizedData = sanitizeInput(name);
    const parsedName = validateInputs(nameSchema, sanitizedData);
    const newFileName = await FileServices.RenameFileByEditorService(
      file,
      parsedName
    );
    return CustomSuccess.send(res, null, StatusCodes.OK, { name: newFileName });
  } catch (error) {
    next(error);
  }
};

export const importFromDrive = async (req, res, next) => {
  const { rootDirId, _id, maxStorageLimit } = req.user;
  const { token, filesMetaData, fileForUploading } = req.body;
  if (
    !token ||
    !Array.isArray(filesMetaData) ||
    filesMetaData.length === 0 ||
    !fileForUploading
  )
    throw new CustomError("Invalid input data", StatusCodes.BAD_REQUEST);

  try {
    const result = await FileServices.ImportFileFromGoogleService(
      rootDirId,
      maxStorageLimit,
      _id,
      fileForUploading,
      filesMetaData,
      token
    );

    return CustomSuccess.send(res, null, StatusCodes.CREATED, {
      result,
    });
  } catch (error) {
    next(error);
  }
};
