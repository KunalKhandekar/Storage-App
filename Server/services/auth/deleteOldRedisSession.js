import redisClient from "../../config/redis.js";

export const deleteOldRedisSession = async (userId) => {
  const userSessions = await redisClient.ft.search(
    "userIdIdx",
    `@userId:{${userId}}`,
    {
      RETURN: [],
    }
  );

  if (userSessions.total >= 2) {
    await redisClient.del(userSessions.documents[0].id);
  }
};
