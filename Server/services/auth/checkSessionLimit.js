import { StatusCodes } from "http-status-codes";
import redisClient from "../../config/redis.js";
import CustomError from "../../utils/ErrorResponse.js";

export const checkSessionLimit = async (userId) => {
  const userSessions = await redisClient.ft.search(
    "userIdIdx",
    `@userId:{${userId}}`,
    {
      RETURN: [],
    }
  );

  if (userSessions.total >= 2) {
    const loginToken = crypto.randomUUID();
    await redisClient.set(
      `temp_login_token:${loginToken}`,
      JSON.stringify({
        userId,
      }),
      { EX: 300 } // 5 mins
    );
    throw new CustomError("Session Limit Exceed", StatusCodes.CONFLICT, {
      details: {
        sessionLimitExceed: true,
        temp_token: loginToken,
      },
    });
  }
};
