import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
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
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";
import { fetchAndUpload } from "../services/file/fetchAndUpload.js";
import { getGoogleFileSize } from "../services/file/getGoogleFileSize.js";
import { updateParentDirectorySize } from "../services/file/index.js";
import CustomError from "../utils/ErrorResponse.js";
import {
  getExportMimeType,
  getFileExtension,
} from "../utils/getExtension&MimeType.js";
import { limiter } from "../utils/RateLimiter.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { FileServices } from "../services/index.js";

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

export default router;
