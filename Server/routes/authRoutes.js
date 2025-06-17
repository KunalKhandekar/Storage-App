import { Router } from "express";
import { loginWithGoogle } from "../controllers/authControllers.js";

const router = Router();

router.post("/google", loginWithGoogle); 

export default router;
