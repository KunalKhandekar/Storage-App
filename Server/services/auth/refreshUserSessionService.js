import { StatusCodes } from "http-status-codes";
import CustomError from "../../utils/ErrorResponse.js";
import redisClient from "../../config/redis.js";
import { createRedisSession } from "./createRedisSession.js";
import { parseTempToken } from "./parseTempToken.js";
import { deleteOldRedisSession } from "./deleteOldRedisSession.js";

export const refreshUserSessionService = async (temp_token) => {
  if (!temp_token) {
    throw new CustomError("Login token not found.", StatusCodes.BAD_REQUEST);
  }

  const userId = await parseTempToken(temp_token);

  await deleteOldRedisSession(userId);
  return await createRedisSession(userId);
};
