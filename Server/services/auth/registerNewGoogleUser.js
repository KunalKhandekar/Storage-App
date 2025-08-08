import { createRedisSession } from "./createRedisSession.js";
import { createUserWithRootDir } from "./createUserWithRootDir.js";

export const registerNewGoogleUser = async (name, email, picture, mongooseSession) => {
  const userId = await createUserWithRootDir(
    name,
    email,
    false,
    "google",
    mongooseSession,
    undefined,
    picture
  );
  return await createRedisSession(userId);
};
