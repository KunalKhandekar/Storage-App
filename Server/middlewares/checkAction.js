import { ReasonPhrases, StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import CustomError from "../utils/ErrorResponse.js";
import { otpMiddlewareValidation } from "../validators/authSchema.js";

const checkAction = async (req, _, next) => {
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
  const user = await User.findOne({ email });
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

    if (user && !user.canLoginWithPassword) {
      throw new CustomError(
        "This account was created with Socail login. Please use Google/Github Sign-In.",
        StatusCodes.BAD_REQUEST
      );
    }

    if (!(await user.comparePassword(password))) {
      throw new CustomError(
        "Invalid email or password",
        StatusCodes.UNAUTHORIZED
      );
    }
  }
  req.email = email;

  next();
};

export default checkAction;
