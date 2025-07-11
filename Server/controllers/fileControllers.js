import { rm } from "fs/promises";
import { google } from "googleapis";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { absolutePath } from "../app.js";
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";
import CustomError from "../utils/ErrorResponse.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { client } from "../services/googleService.js";

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

    if (fileObj.googleFileId) {
      client.setCredentials({
        access_token: req.user.google_access_token,
        refresh_token: req.user.google_refresh_token,
      });

      await client.getAccessToken();

      const drive = google.drive({ version: "v3", auth: client });
      const { googleFileId, storedName, mimeType } = fileObj;
      let streamRes;
      let filename = storedName;

      switch (mimeType) {
        case "application/vnd.google-apps.document":
          streamRes = await drive.files.export(
            {
              fileId: googleFileId,
              mimeType: "application/pdf",
            },
            { responseType: "stream" }
          );
          filename = storedName.replace(/\.[^/.]+$/, "") + ".pdf";
          res.setHeader("Content-Type", "application/pdf");
          break;

        case "application/vnd.google-apps.spreadsheet":
          streamRes = await drive.files.export(
            {
              fileId: googleFileId,
              mimeType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            { responseType: "stream" }
          );
          filename = storedName.replace(/\.[^/.]+$/, "") + ".xlsx";
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          break;

        case "application/vnd.google-apps.presentation":
          streamRes = await drive.files.export(
            {
              fileId: googleFileId,
              mimeType:
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            },
            { responseType: "stream" }
          );
          filename = storedName.replace(/\.[^/.]+$/, "") + ".pptx";
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          );
          break;

        default:
          streamRes = await drive.files.get(
            { fileId: googleFileId, alt: "media" },
            { responseType: "stream" }
          );
          res.setHeader("Content-Type", mimeType || "application/octet-stream");
          break;
      }

      // Get metadata to set file size
      const metadata = await drive.files.get({
        fileId: googleFileId,
        fields: "size",
      });

      if (metadata.data?.size) {
        res.setHeader("Content-Length", metadata.data.size);
      }

      if (req.query.action === "download") {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
      }

      return streamRes.data.pipe(res).on("error", (err) => {
        throw new CustomError(
          "Streaming failed",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      });
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
    if (!fileObj.googleFileId) {
      await rm(path.join(absolutePath, fileObj.storedName));
    }
    return CustomSuccess.send(res, "File deleted", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};
