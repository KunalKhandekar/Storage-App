import redisClient from "../config/redis.js";

export const createSessionAndSetCookie = async (userId, res) => {
  const sessionID = crypto.randomUUID();
  const sessionExpiry = 7 * 24 * 60 * 60 * 1000;
  await redisClient.json.set(`session:${sessionID}`, "$", {
    userId: userId,
  });
  await redisClient.expire(`session:${sessionID}`, sessionExpiry / 1000);
  res.cookie("token", sessionID, {
    httpOnly: true,
    signed: true,
    maxAge: sessionExpiry,
  });
};
