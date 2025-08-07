import { StatusCodes } from "http-status-codes";
import { registerValidations } from "./authSchema.js";
import CustomError from "../utils/ErrorResponse.js";

export const validateRegisterInput = (data) => {
  const parsed = registerValidations.safeParse(data);
  if (!parsed.success) {
    throw new CustomError("Invalid input data", StatusCodes.BAD_REQUEST, {
      details: parsed.error.errors,
    });
  }

  return parsed.data;
};
