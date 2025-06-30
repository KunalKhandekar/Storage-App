import { ReasonPhrases, StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import CustomError from "../utils/ErrorResponse.js";
import { otpMiddlewareValidation } from "../validators/authSchema.js";

const checkAction = async (req, res, next) => {
  const parsed = otpMiddlewareValidation.safeParse(req.body);
  if (!parsed.success) {
    throw new CustomError(
      ReasonPhrases.NOT_ACCEPTABLE,
      StatusCodes.BAD_REQUEST,
      {
        details: parsed.error.issues,
      }
    );
  }

  const { email, action } = parsed.data;
  const user = await User.findOne({ email }).lean();
  if (action === "register") {
    if (user) {
      throw new CustomError("User already exist", StatusCodes.BAD_REQUEST);
    }
  } else if (action === "login") {
    if (!user) {
      throw new CustomError(
        "Invalid email or password",
        StatusCodes.UNAUTHORIZED
      );
    }

    if (user.isDeleted) {
      throw new CustomError(
        "Account has been deactivated. Please contact support.",
        StatusCodes.FORBIDDEN
      );
    }

    if (user && !user.password) {
      throw new CustomError(
        "This account was created with Google. Please use Google Sign-In.",
        StatusCodes.BAD_REQUEST
      );
    }
  }
  req.email = email;
  next();
};

export default checkAction;
