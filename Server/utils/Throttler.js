import redisClient from "../config/redis.js";

const createThrottler = (
  throttlerName,
  useUserId = false,
  delayAfter = 3,
  windowMs = 60000,
  limitPerSecond = 1
) => {
  return async (req, _, next) => {
    try {
      let key = `${throttlerName}:${req.ip}`;
      if (useUserId && req.user?._id) {
        key = `${throttlerName}:${req.user._id}`;
      }
      const now = Date.now();

      const requestDataRaw = await redisClient.get(key);
      let requestData = requestDataRaw
        ? JSON.parse(requestDataRaw)
        : {
            count: 0,
            lastRequestTime: 0,
            windowStart: now,
          };

      let { count, lastRequestTime, windowStart } = requestData;

      // Reset window if expired
      if (now - windowStart > windowMs) {
        requestData = {
          count: 0,
          lastRequestTime: 0,
          windowStart: now,
        };
      }
      const timeDiff = now - (lastRequestTime || 0);
      const minInterval = 1000 / limitPerSecond;

      let newCount = count++;

      if (newCount > delayAfter && timeDiff < minInterval) {
        const delayTime = minInterval - timeDiff;
        await new Promise((resolve, _) => {
          setTimeout(resolve, delayTime);
        });
      }

      await redisClient.set(
        key,
        JSON.stringify({
          count: newCount,
          lastRequestTime: now,
          windowStart: now,
        }),
        "EX",
        Math.ceil(windowMs / 1000)
      );
      next();
    } catch (error) {
      console.error("Throttling error:", error);
      next(); // Pass the request if error occurced.
    }
  };
};

// Arguments: [useUserId, delayAfter, windowMs, limitPerSecond]
const throttlerConfig = {
  // File Routes Throttler
  fileAccessThrottler: [true, 3, 60000, 2], // 2 req/sec, delay after 3 requests, 1min window
  fileInfoThrottler: [true, 2, 30000, 3], // 3 req/sec, delay after 2 requests, 30sec window
  editorRenameThrottler: [true, 2, 45000, 1], // 1 req/sec, delay after 2 requests, 45sec window
  shareLinkToggleThrottler: [true, 2, 30000, 2], // 2 req/sec, delay after 2 requests, 30sec window
  sharePermissionThrottler: [true, 2, 30000, 2], // 2 req/sec, delay after 2 requests, 30sec window
  shareAccessListThrottler: [true, 3, 45000, 2], // 2 req/sec, delay after 3 requests, 45sec window
  dashboardThrottler: [true, 3, 60000, 1], // 1 req/sec, delay after 3 requests, 1min window
  sharedFilesThrottler: [true, 3, 45000, 2], // 2 req/sec, delay after 3 requests, 45sec window
  fileRenameThrottler: [true, 3, 45000, 2], // 2 req/sec, delay after 3 requests, 45sec window

  // Directory Routes Throttler
  getDirThrottler: [true, 5, 60000, 3], // 3 req/sec, delay after 5 requests, 1min window
  createDirThrottler: [true, 3, 45000, 2], // 2 req/sec, delay after 3 requests, 45sec window
  updateDirThrottler: [true, 4, 45000, 2], // 2 req/sec, delay after 4 requests, 45sec window
  
  // User Routes Throttler
  getSpecificUserDirThrottler: [true, 3, 45000, 2], // 2 req/sec, delay after 3 requests, 45sec window
  getAllUsersThrottler: [true, 5, 60000, 2], // 2 req/sec, delay after 5 requests, 1min window
  userInfoThrottler: [true, 4, 45000, 3], // 3 req/sec, delay after 4 requests, 45sec window
  getFileThrottler: [true, 3, 45000, 2], // 2 req/sec, delay after 3 requests, 45sec window
  userSettingsThrottler: [true, 8, 60000, 3], // 3 req/sec, delay after 8 requests, 1min window
  updateProfileThrottler: [true, 3, 60000, 1], // 1 req/sec, delay after 3 requests, 1min window

  // Guest Routes Throttler - Public access (IP-based)
  getFileInfoThrottler: [false, 3, 60000, 1], // 1 req/sec, delay after 3 requests, 1min window
  guestFileAccessThrottler: [false, 3, 60000, 1], // 1 req/sec, delay after 3 requests, 1min window
  guestRenameThrottler: [false, 2, 45000, 1], // 1 req/sec, delay after 2 requests, 45sec window
};

export const throttler = Object.fromEntries(
  Object.entries(throttlerConfig).map(([key, value]) => [
    key,
    createThrottler(key, ...value),
  ])
);
