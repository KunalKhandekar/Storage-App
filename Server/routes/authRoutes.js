import { Router } from "express";
import { loginWithGithub, loginWithGoogle, redirectToAuthURL } from "../controllers/authControllers.js";

const router = Router();

router.post("/google", loginWithGoogle);
router.get("/github", redirectToAuthURL)
router.get("/github/callback", loginWithGithub)

export default router;
