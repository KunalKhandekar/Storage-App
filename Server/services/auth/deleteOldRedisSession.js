import redisClient from "../../config/redis.js";
import User from "../../models/userModel.js";

export const deleteOldRedisSession = async (userId) => {
  const user = await User.findById(userId).select("maxDevices").lean();
  const userSessions = await redisClient.ft.search(
    "userIdIdx",
    `@userId:{${userId}}`,
    {
      RETURN: [],
    }
  );

  if (userSessions.total >= user.maxDevices) {
    await redisClient.del(userSessions.documents[0].id);
  }
};
