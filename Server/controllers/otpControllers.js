import { StatusCodes } from "http-status-codes";
import OTP from "../models/otpModel.js";
import { sendOTPService } from "../services/otpService.js";
import CustomSuccess from "../utils/SuccessResponse.js";

export const sendOTP = async (req, res, next) => {
  const email = req.email;
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const resData = await sendOTPService(email, otp);
    await OTP.updateOne(
      { email },
      { $set: { otp, createdAt: Date.now() } },
      { upsert: true }
    );
    return CustomSuccess.send(
      res,
      `OTP send to ${email}`,
      StatusCodes.CREATED,
      resData
    );
  } catch (error) {
    next(error);
  }
};
