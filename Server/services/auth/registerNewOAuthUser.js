import { createRedisSession } from "./createRedisSession.js";
import { createUserWithRootDir } from "./createUserWithRootDir.js";

export const registerNewOAuthUser = async (
  provider,
  name,
  email,
  picture,
  mongooseSession
) => {
  const userId = await createUserWithRootDir(
    name,
    email,
    false,
    provider,
    mongooseSession,
    undefined,
    picture
  );
  return await createRedisSession(userId);
};
