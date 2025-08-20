import redisClient from "../config/redis.js";

export const createThrottler = (
  throttlerName,
  useUserId = false,
  delayAfter = 3,
  waitTime = 1000
) => {
  return async (req, res, next) => {
    try {
      // Unique key based on IP or userId
      let key = `${throttlerName}:${req.ip.replace(/:/g, "_")}`;
      if (useUserId && req.user?._id) {
        key = `${throttlerName}:${req.user._id.toString()}`;
      }

      const now = Date.now();
      const requestDataRaw = await redisClient.get(key);
      let { count, previousDelay, lastRequestTime } = requestDataRaw
        ? JSON.parse(requestDataRaw)
        : {
            count: 0,
            previousDelay: 0,
            lastRequestTime: now - waitTime,
          };

      count += 1;
      let delay = 0;

      if (count >= delayAfter) {
        const timeDiff = now - lastRequestTime;
        delay = Math.max(0, waitTime + previousDelay - timeDiff);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      await redisClient.set(
        key,
        JSON.stringify({
          count,
          previousDelay: delay,
          lastRequestTime: Date.now(),
        }),
        { EX: 10 * 60 } // 10 minutes
      );

      next();
    } catch (error) {
      console.error(`[Throttler:${throttlerName}] Error:`, error);
      next();
    }
  };
};

export const throttlerConfig = {
  // File Routes
  fileAccessThrottler: [true, 3, 1000],
  fileInfoThrottler: [true, 2, 1000],
  editorRenameThrottler: [true, 2, 1000],
  shareLinkToggleThrottler: [true, 2, 1000],
  sharePermissionThrottler: [true, 2, 1000],
  shareAccessListThrottler: [true, 3, 1000],
  dashboardThrottler: [true, 3, 1000],
  sharedFilesThrottler: [true, 3, 1000],
  fileRenameThrottler: [true, 3, 1000],

  // Directory Routes
  getDirThrottler: [true, 5, 1000],
  createDirThrottler: [true, 3, 1000],
  updateDirThrottler: [true, 4, 1000],

  // User Routes
  getSpecificUserDirThrottler: [true, 3, 1000],
  getAllUsersThrottler: [true, 5, 1000],
  userInfoThrottler: [true, 4, 1000],
  getFileThrottler: [true, 3, 1000],
  userSettingsThrottler: [true, 8, 1000],
  updateProfileThrottler: [true, 3, 1000],

  // Guest Routes (IP-based)
  getFileInfoThrottler: [false, 3, 1000],
  guestFileAccessThrottler: [false, 3, 1000],
  guestRenameThrottler: [false, 2, 1000],
};

export const throttler = Object.fromEntries(
  Object.entries(throttlerConfig).map(([key, value]) => [
    key,
    createThrottler(key, ...value),
  ])
);
