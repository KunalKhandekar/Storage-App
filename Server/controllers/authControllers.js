import { StatusCodes } from "http-status-codes";
import githubClient from "../services/auth/githubAuthService.js";
import { connectGoogleDrive } from "../services/auth/googleService.js";
import { AuthServices } from "../services/index.js";
import { sanitizeObject } from "../utils/sanitizeInput.js";
import { setCookie } from "../utils/setCookie.js";
import CustomSuccess from "../utils/SuccessResponse.js";
import { validateInputs } from "../utils/ValidateInputs.js";
import {
  loginValidations,
  registerValidations,
} from "../validators/authSchema.js";

export const registerUser = async (req, res, next) => {
  try {
    const sanitizedData = sanitizeObject(req.body);
    const parsedData = validateInputs(registerValidations, sanitizedData);
    await AuthServices.RegisterUserService(parsedData);
    return CustomSuccess.send(res, "User registered", StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const sanitizedData = sanitizeObject(req.body);
    const parsedData = validateInputs(loginValidations, sanitizedData);
    const { sessionID, sessionExpiry } =
      await AuthServices.LoginUserService(parsedData);
    setCookie(res, sessionID, sessionExpiry);
    return CustomSuccess.send(res, "Logged in successful", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const loginWithGoogle = async (req, res, next) => {
  const code = req.body.code;

  try {
    const { sessionExpiry, sessionID } =
      await AuthServices.LoginWithGoogleService(code);
    setCookie(res, sessionID, sessionExpiry);
    return CustomSuccess.send(res, "Logged in Successfull", StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const redirectToAuthURL = async (_, res) => {
  const { state, url } = githubClient.getWebFlowAuthorizationUrl({
    scopes: ["read:user", "user:email"],
    redirectUrl: `${process.env.BASE_URL}/auth/github/callback`,
  });

  res.cookie("_github_state", state, {
    httpOnly: true,
    signed: true,
    maxAge: 1000 * 60 * 10,
  });

  res.redirect(url);
};

export const loginWithGithub = async (req, res, next) => {
  const { _github_state } = req.signedCookies;
  const { code, state } = req.query;

  try {
    const { sessionID, sessionExpiry } =
      await AuthServices.LoginWithGitHubService(_github_state, code, state);
    setCookie(res, sessionID, sessionExpiry);
    res.redirect(`${process.env.CLIENT_URL}/`);
  } catch (error) {
    if (error?.details?.sessionLimitExceed) {
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/error?temp_token=${encodeURIComponent(error?.details?.temp_token)}`
      );
    }
    return res.redirect(
      `${process.env.CLIENT_URL}/auth/error?message=${encodeURIComponent(error.message)}`
    );
  }
};

export const connectToDrive = async (req, res, next) => {
  const code = req.body.code;
  try {
    const files = await connectGoogleDrive(code, req.user);
    return CustomSuccess.send(res, "Files imported", StatusCodes.OK, {
      files,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteAndCreateSession = async (req, res, next) => {
  const { temp_token } = req.body;
  try {
    const { sessionExpiry, sessionID } =
      await AuthServices.RefreshUserSessionService(temp_token);
    setCookie(res, sessionID, sessionExpiry);
    return CustomSuccess.send(res, "Session Created", StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};
