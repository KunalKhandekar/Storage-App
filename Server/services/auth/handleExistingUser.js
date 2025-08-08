import { checkSessionLimit } from "./checkSessionLimit.js";
import { createRedisSession } from "./createRedisSession.js";

export const handleExistingUser = async (userId) => {
  await checkSessionLimit(userId);
  return await createRedisSession(userId);
};
