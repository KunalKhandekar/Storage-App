import redisClient from "../../config/redis.js";

export const createRedisSession = async (userId) => {
  const sessionID = crypto.randomUUID();
  const sessionExpiry = 7 * 24 * 60 * 60 * 1000;
  await redisClient.json.set(`session:${sessionID}`, "$", {
    userId,
  });
  await redisClient.expire(`session:${sessionID}`, sessionExpiry / 1000);

  return {
    sessionID,
    sessionExpiry,
  };
};
