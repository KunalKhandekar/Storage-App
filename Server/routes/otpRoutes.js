import express from "express";
import { sendOTP } from "../controllers/otpControllers.js";
import checkAction from "../middlewares/checkAction.js";

const router = express.Router();

// POST /otp/send-otp
// Desc  -> Send OTP for email verification during login or registration.
// Body  -> { email: string, action: "login" | "register", password?: string }
router.post("/send-otp", checkAction, sendOTP);

export default router;
