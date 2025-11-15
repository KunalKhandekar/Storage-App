import { StatusCodes } from "http-status-codes";
import githubClient from "../services/auth/githubAuthService.js";
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

export const redirectToAuthURL = async (req, res) => {
  const clientOrigin = req.get("referer")?.replace(/\/$/, "");
  const allowed = process.env.CLIENT_URLS.split(",");
  if (!allowed.includes(clientOrigin)) {
    return res.status(400).json({ error: "Unauthorized client" });
  }
  const { state: githubState, url } = githubClient.getWebFlowAuthorizationUrl({
    scopes: ["read:user", "user:email"],
    redirectUrl: `https://api.storemystuff.cloud/auth/github/callback`,
  });

  const combinedState = Buffer.from(
    JSON.stringify({
      githubState,
      clientOrigin,
    })
  ).toString("base64");

  res.cookie("_github_state", githubState, {
    httpOnly: true,
    signed: true,
    maxAge: 1000 * 60 * 10,
  });

  const redirectURL = `${url}&state=${combinedState}`;
  res.redirect(redirectURL);
};

export const loginWithGithub = async (req, res, next) => {
  const { _github_state } = req.signedCookies;
  const { code, state } = req.query;

  try {
    const { githubState, clientOrigin } = JSON.parse(
      Buffer.from(state, "base64").toString()
    );
    const { sessionID, sessionExpiry } =
      await AuthServices.LoginWithGitHubService(
        _github_state,
        code,
        githubState
      );
    setCookie(res, sessionID, sessionExpiry);

    return res.redirect(`${clientOrigin}/`);
  } catch (error) {
    const fallback = process.env.DEFAULT_CLIENT_URL;
    if (error?.details?.sessionLimitExceed) {
      return res.redirect(
        `${fallback}/auth/error?temp_token=${encodeURIComponent(
          error?.details?.temp_token
        )}`
      );
    }

    return res.redirect(
      `${fallback}/auth/error?message=${encodeURIComponent(error.message)}`
    );
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
