import { Router } from "express";
import {
  connectToDrive,
  DeleteAndCreateSession,
  loginUser,
  loginWithGithub,
  loginWithGoogle,
  redirectToAuthURL,
  registerUser,
} from "../controllers/authControllers.js";
import checkAuth from "../middlewares/auth.js";
import { limiter } from "../utils/RateLimiter.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { StatusCodes } from "http-status-codes";
import mime from "mime-types";
import { s3Client } from "../services/file/s3Services.js";
import path from "node:path";
import axios from "axios";
import { Upload } from "@aws-sdk/lib-storage";
import mongoose from "mongoose";
import File from "../models/fileModel.js";
import Directory from "../models/dirModel.js";
import { updateParentDirectorySize } from "../services/file/index.js";
import {
  getExportMimeType,
  getFileExtension,
} from "../utils/getExtension&MimeType.js";
import CustomError from "../utils/ErrorResponse.js";

const router = Router();

// POST /auth/register
// Desc -> Register a new user.
// Body -> { name: string, email: string, password: string, otp: number }
router.post("/register", limiter.registerLimiter, registerUser);

// POST /auth/session
// Desc -> Delete previous and create new session
// Body -> { temp_token: string }
router.post("/session", limiter.sessionRecreateLimiter, DeleteAndCreateSession);

// POST /auth/login
// Desc -> Login existing user
// Body -> { email: string, password: string, otp: number }
router.post("/login", limiter.loginLimiter, loginUser);

// POST /auth/google
// Desc  -> Login or register a user using Google OAuth.
// Body  -> { code: string }
router.post("/google", limiter.googleLimiter, loginWithGoogle);

// GET /auth/github
// Desc  -> Generate GitHub OAuth URL for login or registration.
router.get("/github", redirectToAuthURL);

// GET /auth/github/callback
// Desc  -> Handle GitHub OAuth callback for login or registration.
// Query -> { code: string, state: string }
router.get("/github/callback", limiter.githubLimiter, loginWithGithub);

// POST /auth/google/drive/connect
// Desc  -> Connect and import files from the user's Google Drive.
// Body  -> { code: string }
// Auth  -> Requires user to be authenticated.
router.post(
  "/google/drive/connect",
  checkAuth,
  limiter.connectDriveLimiter,
  connectToDrive
);

// --- Helper ---
async function fetchAndUpload({
  url,
  headers,
  params,
  key,
  bucket,
  contentType,
}) {
  const resp = await axios({
    method: "GET",
    url,
    headers,
    responseType: "stream",
    params,
  });
  if (resp.status >= 400) throw new Error(`Drive API error ${resp.status}`);

  let size = 0;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: resp.data,
      ContentType: contentType || resp.headers["content-type"],
    },
  });

  // Listen for progress events
  upload.on("httpUploadProgress", (progress) => {
    if (progress.loaded) size = progress.loaded;
  });

  await upload.done();

  return { key, size };
}

// POST /auth/drive-import
// Desc -> Import all files from google Drive
// Body -> { token: string, filesMetaData: Array }
// --- Main route ---
async function getGoogleFileSize(file, token) {
  const isGoogleNative = file.mimeType?.startsWith(
    "application/vnd.google-apps"
  );
  const url = isGoogleNative
    ? `https://www.googleapis.com/drive/v3/files/${file.id}/export`
    : `https://www.googleapis.com/drive/v3/files/${file.id}`;

  const params = isGoogleNative
    ? { mimeType: getExportMimeType(file.mimeType) }
    : { alt: "media" };

  const res = await axios.head(url, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return Number(res.headers["content-length"]) || 0;
}

router.post("/drive-import", checkAuth, async (req, res, next) => {
  const { token, filesMetaData, fileForUploading } = req.body;
  if (!token || !Array.isArray(filesMetaData) || filesMetaData.length === 0 || !fileForUploading)
    return res.status(400).json({ error: "Invalid input" });

  try {
    const userRootDir = await Directory.findById(req.user.rootDirId)
      .select("size")
      .lean();

    const availableSpace = req.user.maxStorageLimit - userRootDir.size;

    // ✅ Calculate real sizes for all files
    const fileSizes = await Promise.all(
      filesMetaData.map(async (file) => {
        if (file.sizeBytes && file.sizeBytes > 0) return file.sizeBytes;
        return await getGoogleFileSize(file, token);
      })
    );

    const totalSize = fileSizes.reduce((acc, s) => acc + s, 0);

    if (totalSize > availableSpace) {
      throw new CustomError(
        `Not enough storage space. Available: ${(availableSpace / (1024 * 1024)).toFixed(2)} MB, Required: ${(totalSize / (1024 * 1024)).toFixed(2)} MB.`,
        StatusCodes.FORBIDDEN
      );
    }

    // ✅ Ensure Google Drive root directory exists
    let googleRootDir = await Directory.findOne({
      name: "Google Drive",
      userId: req.user._id,
    });
    if (!googleRootDir) {
      const newId = new mongoose.Types.ObjectId();
      const parentDirectory = await Directory.findById(req.user.rootDirId)
        .select("path")
        .lean();
      googleRootDir = await Directory.create({
        _id: newId,
        name: "Google Drive",
        parentDirId: req.user.rootDirId,
        userId: req.user._id,
        path: [...(parentDirectory.path || []), newId],
      });
    }

    // ✅ Upload only the first file
    const file = fileForUploading;
    const id = file.id;
    const originalName = file.name || id;
    const ext = getFileExtension(originalName, file.mimeType);
    const fileId = new mongoose.Types.ObjectId();
    const isGoogleNative = file.mimeType?.startsWith(
      "application/vnd.google-apps"
    );

    // Get actual size (use HEAD if sizeBytes = 0)
    const actualSize =
      file.sizeBytes && file.sizeBytes > 0
        ? file.sizeBytes
        : await getGoogleFileSize(file, token);

    // prepare uploads
    const uploads = [
      fetchAndUpload({
        url: isGoogleNative
          ? `https://www.googleapis.com/drive/v3/files/${id}/export`
          : `https://www.googleapis.com/drive/v3/files/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        params: isGoogleNative
          ? { mimeType: getExportMimeType(file.mimeType) }
          : { alt: "media" },
        key: `${fileId}${ext}`,
        bucket: process.env.AWS_BUCKET,
        contentType: file.mimeType,
      }),
    ];

    if (isGoogleNative) {
      uploads.push(
        fetchAndUpload({
          url: `https://www.googleapis.com/drive/v3/files/${id}/export`,
          headers: { Authorization: `Bearer ${token}` },
          params: { mimeType: "application/pdf" },
          key: `${fileId}.pdf`,
          bucket: process.env.AWS_BUCKET,
          contentType: "application/pdf",
        })
      );
    }

    const [origUpload, pdfUpload] = await Promise.all(uploads);

    const finalName = originalName.includes(".")
      ? originalName
      : originalName + ext;

    await File.create({
      _id: fileId,
      name: finalName,
      originalKey: origUpload?.key,
      pdfKey: pdfUpload?.key || null,
      parentDirId: googleRootDir._id,
      size: actualSize || origUpload?.size || 0,
      userId: req.user._id,
      googleFileId: id,
      isUploading: false,
    });

    await updateParentDirectorySize(googleRootDir._id, actualSize);

    return CustomSuccess.send(res, null, StatusCodes.CREATED, {
      result: {
        id,
        success: true,
        originalKey: origUpload?.key,
        pdfKey: pdfUpload?.key || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
