import { checkSessionLimit } from "./checkSessionLimit.js";
import { createRedisSession } from "./createRedisSession.js";
import { isValidCredentials } from "./isValidCredentials.js";
import { isValidOTP } from "./isValidOTP.js";

export const loginUserService = async (data) => {
  try {
    const { email, password, otp } = data;

    const user = await isValidCredentials(email, password);
    await isValidOTP(email, otp);

    await checkSessionLimit(user._id);

    const sessionInfo = await createRedisSession(user._id);

    return sessionInfo;
  } catch (error) {
    throw error;
  }
};
