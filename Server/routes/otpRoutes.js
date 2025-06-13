import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otpControllers.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
