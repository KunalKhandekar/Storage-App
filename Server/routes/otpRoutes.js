import express from "express";
import { sendOTP } from "../controllers/otpControllers.js";
import checkAction from "../middlewares/checkAction.js";

const router = express.Router();

router.post("/send-otp", checkAction, sendOTP);

export default router;
