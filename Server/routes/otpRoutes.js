import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otpControllers.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post(
  "/send-otp",
  async (req, res, next) => {
    const { email, action } = req.body;
    if (action !== "login") {
      const user = await User.findOne({ email }).lean();
      if (user) {
        return res
          .status(401)
          .json({ message: "User already exist. Please Login!" });
      }
    }
    next();
  },
  sendOTP
);
router.post("/verify-otp", verifyOTP);

export default router;
