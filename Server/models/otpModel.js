import { model, Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600,
    },
    otp: {
      type: Number,
      required: true,
    },
  },
  {
    strict: "throw",
  }
);

const OTP = model("OTP", otpSchema);
export default OTP;
