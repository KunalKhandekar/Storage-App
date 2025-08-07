import { StatusCodes } from "http-status-codes";
import CustomError from "../utils/ErrorResponse.js";
import { loginValidations } from "./authSchema.js";

export const validateLoginInputs = (data) => {
  const parsed = loginValidations.safeParse(data);
  if (!parsed.success) {
    throw new CustomError("Invalid or Expired OTP.", StatusCodes.BAD_REQUEST, {
      details: parsed.error.issues,
    });
  }

  return parsed.data;
};
