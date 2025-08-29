import { StatusCodes } from "http-status-codes";
import CustomError from "./ErrorResponse.js";

export const validateInputs = (
  schema,
  data,
  errMessage = "Invalid data, Please enter valid details."
) => {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new CustomError(errMessage, StatusCodes.BAD_REQUEST, {
      details: parsed.error
    });
  }

  return parsed.data;
};
