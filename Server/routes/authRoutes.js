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

// POST /auth/drive-import
// Desc -> Import all files from google Drive
// Body -> { token: string, filesMetaData: Array }
router.post("/drive-import", checkAuth, async (req, res, next) => {
  const { token, filesMetaData } = req.body;
  if (!token) return res.status(400).json({ error: "Missing token" });
  if (!Array.isArray(filesMetaData) || filesMetaData.length === 0) {
    return res.status(400).json({ error: "Missing filesMetaData" });
  }

  const results = [];
  let googleRootDir = await Directory.findOne({
    name: "Google Drive",
    userId: req.user._id,
  }).lean();

  if (!googleRootDir) {
    googleRootDir = await Directory.create({
      name: "Google Drive",
      parentDirId: req.user.rootDirId,
      userId: req.user._id,
    });
  }

  for (const file of filesMetaData) {
    const id = file.id;
    const originalName = file.name || id;
    const ext = getFileExtension(originalName, file.mimeType);
    try {
      // Build Drive request
      const isGoogleNative = file.mimeType?.startsWith(
        "application/vnd.google-apps"
      );

      const axiosConfig = {
        method: "GET",
        url: isGoogleNative
          ? `https://www.googleapis.com/drive/v3/files/${id}/export`
          : `https://www.googleapis.com/drive/v3/files/${id}`,
        headers: { Authorization: `Bearer ${token}` },
        responseType: "stream",
        params: isGoogleNative
          ? { mimeType: getExportMimeType(file.mimeType) }
          : { alt: "media" },
        validateStatus: (s) => s >= 200 && s < 500,
      };

      const driveResp = await axios(axiosConfig);

      if (driveResp.status === 401) {
        results.push({
          id,
          error: "Unauthorized: access token may be expired",
        });
        continue;
      }
      if (driveResp.status >= 400) {
        results.push({
          id,
          error: `Drive API error ${driveResp.status}: ${driveResp.statusText}`,
        });
        continue;
      }

      const contentType =
        driveResp.headers["content-type"] ||
        file.mimeType ||
        "application/octet-stream";

      const fileId = new mongoose.Types.ObjectId();

      const key = `${fileId}${ext}`;

      // 🚀 Use @aws-sdk/lib-storage for multipart upload
      const parallelUpload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.AWS_BUCKET,
          Key: key,
          Body: driveResp.data, // stream
          ContentType: contentType,
        },
      });

      parallelUpload.on("httpUploadProgress", (progress) => {
        console.log(`Uploading ${id}:`, progress);
        if (file.sizeBytes === 0) {
          file.sizeBytes = progress.total;
        }
      });

      const uploadResult = await parallelUpload.done();

      const finalName = originalName.includes(".")
        ? originalName
        : originalName + ext;
      await File.create({
        _id: fileId,
        name: finalName,
        isUploading: false,
        parentDirId: googleRootDir._id,
        size: file.sizeBytes,
        userId: req.user._id,
        mimeType: file.mimeType,
        googleFileId: file.id,
      });

      await updateParentDirectorySize(googleRootDir._id, file.sizeBytes);
      results.push({ id, s3Key: key, s3Location: uploadResult.Location });
    } catch (err) {
      console.error("Upload error for", id, err?.message || err);
      results.push({ id, error: err?.message || String(err) });
    }
  }

  return CustomSuccess.send(res, "Files received", StatusCodes.CREATED, {
    results,
  });
});

export default router;
