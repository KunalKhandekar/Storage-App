import OTP from "../models/otpModel.js";
import { sendOTPService } from "../services/otpService.js";

export const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const resData = await sendOTPService(email, otp);
    await OTP.updateOne(
      { email },
      { $set: { otp, createdAt: Date.now() } },
      { upsert: true }
    );
    return res.status(201).json(resData);
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  const isValid = await OTP.findOne({ email, otp });
  if (!isValid) {
    return res.status(400).json({ error: "Invalid or Expired OTP." });
  }

  await OTP.deleteOne({ email });

  return res.status(200).json({ message: "OTP Verified Successful" });
};
