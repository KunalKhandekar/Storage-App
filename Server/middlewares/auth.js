import { ReasonPhrases, StatusCodes } from "http-status-codes";
import CustomError from "../utils/ErrorResponse.js";
import redisClient from "../config/redis.js";
import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { token } = req.signedCookies;

  if (!token)
    throw new CustomError("No active session found", StatusCodes.UNAUTHORIZED);
  const session = await redisClient.json.get(`session:${token}`);
  if (!session)
    throw new CustomError("No active session found", StatusCodes.UNAUTHORIZED);
  const user = await User.findById(session.userId).select("-password").lean();
  if (user.isDeleted)
    throw new CustomError("User is deactivated or deleted.", StatusCodes.FORBIDDEN);

  req.user = user;
  next();
}
