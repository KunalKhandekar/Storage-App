import { ReasonPhrases, StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import CustomError from "../utils/ErrorResponse.js";
import { otpMiddlewareValidation } from "../validators/authSchema.js";

const checkAction = async (req, res, next) => {
  try {
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

    const { email, action, password } = parsed.data;
    const user = await User.findOne({ email }).select(
      "+password +isDeleted +canLoginWithPassword"
    );

    switch (action) {
      case "register":
        if (user) {
          throw new CustomError("User already exists", StatusCodes.BAD_REQUEST);
        }
        break;

      case "login":
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

        if (!user.canLoginWithPassword) {
          throw new CustomError(
            "This account was created with Social login. Please use Google/Github Sign-In.",
            StatusCodes.BAD_REQUEST
          );
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new CustomError(
            "Invalid email or password",
            StatusCodes.UNAUTHORIZED
          );
        }
        break;

      default:
        throw new CustomError("Invalid action", StatusCodes.BAD_REQUEST);
    }

    req.email = email;
    next();
  } catch (err) {
    next(err);
  }
};

export default checkAction;
