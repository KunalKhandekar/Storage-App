import { Resend } from "resend";
import CustomError from "../utils/ErrorResponse.js";
import { StatusCodes } from "http-status-codes";

const resend = new Resend(process.env.RESEND_KEY);

export const sendOTPService = async (email, otp) => {
  try {
    const res = await resend.emails.send({
      from: "StoreMyStuff <no-reply@storemystuff.cloud>",
      to: [email],
      subject: "Your OTP for Authentication",
      text: `Your OTP is ${otp}`,
    });

    return res;
  } catch (error) {
    throw new CustomError(
      "Error while sending email",
      StatusCodes.INTERNAL_SERVER_ERROR,
      {
        details: error.message,
      }
    );
  }
};
