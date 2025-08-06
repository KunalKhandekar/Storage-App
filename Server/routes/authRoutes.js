import { Router } from "express";
import {
    connectToDrive,
    DeleteAndCreateSession,
    loginUser,
    loginWithGithub,
    loginWithGoogle,
    redirectToAuthURL,
    registerUser
} from "../controllers/authControllers.js";
import checkAuth from "../middlewares/auth.js";

const router = Router();

// POST /auth/register
// Desc -> Register a new user.
// Body -> { name: string, email: string, password: string, otp: number }
router.post("/register", registerUser);

// POST /auth/session
// Desc -> Delete previous and create new session
// Body -> { temp_token: string }
router.post("/session", DeleteAndCreateSession);

// POST /auth/login
// Desc -> Login existing user
// Body -> { email: string, password: string, otp: number }
router.post("/login", loginUser);

// POST /auth/google
// Desc  -> Login or register a user using Google OAuth.
// Body  -> { code: string }
router.post("/google", loginWithGoogle);

// GET /auth/github
// Desc  -> Generate GitHub OAuth URL for login or registration.
router.get("/github", redirectToAuthURL);

// GET /auth/github/callback
// Desc  -> Handle GitHub OAuth callback for login or registration.
// Query -> { code: string, state: string }
router.get("/github/callback", loginWithGithub);

// POST /auth/google/drive/connect
// Desc  -> Connect and import files from the user's Google Drive.
// Body  -> { code: string }
// Auth  -> Requires user to be authenticated.
router.post("/google/drive/connect", checkAuth, connectToDrive);

export default router;
