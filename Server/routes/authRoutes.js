import { Router } from "express";
import {
    connectToDrive,
    getDriveProgress,
    loginWithGithub,
    loginWithGoogle,
    redirectToAuthURL,
} from "../controllers/authControllers.js";
import checkAuth from "../middlewares/auth.js";

const router = Router();

router.post("/google", loginWithGoogle);
router.get("/github", redirectToAuthURL);
router.get("/github/callback", loginWithGithub);
router.post("/google/drive/connect", checkAuth, connectToDrive);
router.get("/drive-progress", checkAuth, getDriveProgress);

export default router;
