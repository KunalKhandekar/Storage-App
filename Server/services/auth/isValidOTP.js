import { StatusCodes } from "http-status-codes";
import OTP from "../../models/otpModel.js";
import CustomError from "../../utils/ErrorResponse.js";

export const isValidOTP = async (email, otp) => {
  console.log(otp);
  const isValid = await OTP.findOne({ email, otp }).lean();
  if (!isValid) {
    throw new CustomError("Invalid or Expired OTP.", StatusCodes.BAD_REQUEST);
  }
  await OTP.deleteOne({ email });
};
