import redisClient from "../../config/redis.js";

export const parseTempToken = async (token) => {
  const isTokenStored = await redisClient.get(`temp_login_token:${token}`);

  if (!isTokenStored) {
    throw new CustomError("Token is Invalid or Expired");
  }

  const { userId } = JSON.parse(isTokenStored);
  await redisClient.del(`temp_login_token:${token}`);

  return userId;
};
