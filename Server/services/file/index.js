import { StatusCodes } from "http-status-codes";
import { extname } from "node:path";
import Directory from "../../models/dirModel.js";
import File from "../../models/fileModel.js";
import User from "../../models/userModel.js";
import CustomError from "../../utils/ErrorResponse.js";
import {
  deleteS3Object,
  generatePreSignedUploadURL,
  getFileContentLength,
} from "./s3Services.js";

export const updateParentDirectorySize = async (
  parentDirectoryId,
  deltaSize
) => {
  const parents = [];

  while (parentDirectoryId) {
    const parentDirectory = await Directory.findById(
      parentDirectoryId,
      "parentDirId"
    );
    if (!parentDirectory) break;
    parents.push(parentDirectory._id);
    parentDirectoryId = parentDirectory.parentDirId;
  }

  if (parents.length > 0) {
    await Directory.updateMany(
      { _id: { $in: parents } },
      { $inc: { size: deltaSize } }
    );
  }
};

const uploadFileInitiateService = async (
  rootDirId,
  userId,
  maxStorageLimit,
  name,
  size,
  contentType,
  parentDirId
) => {
  const rootDirectory = await Directory.findOne({
    _id: rootDirId,
    userId,
  })
    .select("size")
    .lean();

  if (!rootDirectory) {
    throw new CustomError("Root directory not found.", StatusCodes.NOT_FOUND);
  }

  if (rootDirectory.size + size > maxStorageLimit) {
    throw new CustomError(
      `${name} size is larger than available space.`,
      StatusCodes.FORBIDDEN
    );
  }

  let targetDirectory = rootDirectory;

  if (parentDirId && parentDirId !== String(rootDirId)) {
    targetDirectory = await Directory.findOne({
      _id: parentDirId,
      userId,
    }).lean();

    if (!targetDirectory) {
      throw new CustomError(
        "You are not authorized to upload in this directory.",
        StatusCodes.UNAUTHORIZED
      );
    }
  }

  const fileExt = extname(name);
  const newFile = await File.create({
    userId,
    size,
    name,
    parentDirId: targetDirectory._id,
    isUploading: true,
  });

  const uploadURL = await generatePreSignedUploadURL({
    Key: `${newFile._id}${fileExt}`,
    ContentType: contentType,
  });

  return { uploadURL, newFileId: newFile._id };
};

const uploadFileCompleteService = async (fileId, userId) => {
  const file = await File.findOne({
    _id: fileId,
    userId,
    isUploading: true,
  });

  if (!file) {
    throw new CustomError("File not found.", StatusCodes.BAD_REQUEST);
  }

  const key = `${file._id}${extname(file.name)}`;
  const contentLength = await getFileContentLength({ Key: key });

  if (contentLength !== file.size) {
    await deleteS3Object({ Key: key });
    await file.deleteOne();
    throw new CustomError(
      `File length mismatch. Expected ${file.size}, got ${contentLength}`,
      StatusCodes.BAD_REQUEST
    );
  }

  file.isUploading = false;
  await file.save();

  await updateParentDirectorySize(file.parentDirId, file.size);
};

const getFileService = async (id, userId) => {
  const file = await File.findOne({
    _id: id,
    userId,
  });

  if (!file) {
    throw new CustomError("File not found", StatusCodes.NOT_FOUND);
  }

  return file;
};

const renameFileService = async (id, userId, name) => {
  const file = await File.findOne({
    _id: id,
    userId,
  }).lean();

  if (!file) {
    throw new CustomError("File not found", StatusCodes.NOT_FOUND);
  }
  await File.updateOne({ _id: file._id }, { $set: { name } }).lean();

  return file;
};

const deleteFileService = async (id, userId) => {
  const file = await File.findOne({
    _id: id,
    userId,
  });

  if (!file) {
    throw new CustomError("File not found", StatusCodes.NOT_FOUND);
  }

  if (!file.googleFileId) {
    await deleteS3Object({
      Key: `${file._id}${extname(file.name)}`,
    });
  }

  await File.deleteOne({ _id: file._id });

  await updateParentDirectorySize(file.parentDirId, -file.size);

  return file;
};

const shareViaEmailService = async (users, file) => {
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

  return response;
};

const shareviaLinkService = async (file, permission) => {
  if (file?.sharedViaLink?.token) {
    return {
      link: `${process.env.CLIENT_URL}/guest/access/${file._id}?token=${file.sharedViaLink.token}`,
      permission: file.sharedViaLink.permission,
      enabled: file.sharedViaLink.enabled,
    };
  }

  file.sharedViaLink = {
    enabled: false,
    permission,
    token: crypto.randomUUID(),
  };

  await file.save();

  return {
    link: `${process.env.CLIENT_URL}/guest/access/${file._id}?token=${file.sharedViaLink.token}`,
    permission: file.sharedViaLink.permission,
    enabled: file.sharedViaLink.enabled,
  };
};

const shareLinkToggleService = async (file, enabled) => {
  file.sharedViaLink.enabled = enabled;
  await file.save();

  return file.sharedViaLink.permission;
};

const getSharedFileViaLinkService = async (fileId, token) => {
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
    throw new CustomError("File Access token is Invalid", StatusCodes.CONFLICT);
  }

  return file;
};

const getFileInfoService = async (fileId) => {
  const file = await File.findById(fileId)
    .select("name sharedViaLink userId")
    .populate("userId");

  const url = `${process.env.BASE_URL}/guest/file/view/${file._id}?token=${file.sharedViaLink.token}`;

  return {
    _id: file._id,
    url,
    name: file.name,
    sharedBy: file.userId.name,
    isAccessible: file.sharedViaLink.enabled,
    permission: file.sharedViaLink.permission,
  };
};

const getSharedFileViaEmailService = async (fileId, userId) => {
  const file = await File.findById(fileId).lean();
  if (!file) {
    throw new CustomError("File not found", StatusCodes.NOT_FOUND);
  }

  const hasAccess = file.sharedWith.find((u) => u.userId.equals(userId));

  if (!hasAccess) {
    throw new CustomError(
      "You are not authorized to access this file.",
      StatusCodes.UNAUTHORIZED
    );
  }

  return file;
};

const changeFileSharePermissionService = async (file, permission) => {
  file.sharedViaLink.permission = permission;
  await file.save();

  return file.sharedViaLink.permission;
};

const changePermissionOfUserService = async (file, permission, userId) => {
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

  return collaborator.permission;
};

const revokeUserAccessService = async (file, userId) => {
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
};

const getUserAccessListService = async (fileId, userId) => {
  const sharedUsers =
    (
      await File.findById(fileId)
        .populate("sharedWith.userId", "name email picture")
        .select("sharedWith.userId sharedWith.permission sharedWith.sharedAt")
        .lean()
    )?.sharedWith || [];

  const allUsers = (
    await User.find().select("name email picture").lean()
  ).filter((u) => !userId.equals(u._id));

  const sharedUserIdArray = sharedUsers.map((u) => u.userId._id.toString());

  const availableUsers = allUsers.filter(
    (u) => !sharedUserIdArray.includes(u._id.toString())
  );

  return {
    sharedUsers,
    availableUsers,
  };
};

const renameFileByEditorService = async (file, name) => {
  file.name = name;
  await file.save();
  return file.name;
};

export default {
  UploadFileInitiateService: uploadFileInitiateService,
  UploadFileCompleteService: uploadFileCompleteService,
  GetFileService: getFileService,
  RenameFileService: renameFileService,
  DeleteFileService: deleteFileService,
  ShareViaEmailService: shareViaEmailService,
  ShareviaLinkService: shareviaLinkService,
  ShareLinkToggleService: shareLinkToggleService,
  GetSharedFileViaLinkService: getSharedFileViaLinkService,
  GetFileInfoService: getFileInfoService,
  GetSharedFileViaEmailService: getSharedFileViaEmailService,
  ChangeFileSharePermissionService: changeFileSharePermissionService,
  ChangePermissionOfUserService: changePermissionOfUserService,
  RevokeUserAccessService: revokeUserAccessService,
  GetUserAccessListService: getUserAccessListService,
  RenameFileByEditorService: renameFileByEditorService,
};
