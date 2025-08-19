import { rateLimit, ipKeyGenerator } from "express-rate-limit";

const _15Mins = 15 * 60 * 1000;
const _10Mins = 10 * 60 * 1000;

export const RateLimiter = ({
  windowTimeInMs = _15Mins, // default: 15 min
  limit = 150, // default: 150 requests
  message = "Too many requests. Please try again later.",
  keyGenerator = (req, res) => ipKeyGenerator(req.ip, 56), // default: IP-based with IPv6 support
} = {}) => {
  return rateLimit({
    windowMs: windowTimeInMs,
    max: limit,
    message,
    keyGenerator,
  });
};

// Factory to generate independent limiter instances
const makeLimiter = (
  limit,
  windowMs,
  useUserId = false,
  useIp = true,
  message = "Too many attempts, try again later."
) => {
  return RateLimiter({
    keyGenerator: (req, res) => {
      if (useUserId && req.user?._id) return req.user._id;
      if (useIp) return ipKeyGenerator(req.ip, 56);
    },
    limit,
    windowTimeInMs: windowMs,
    message,
  });
};

const rateLimiterConfig = {
    // Auth Routes Limiters
    registerLimiter: [20, _10Mins, false, true, "Too many registration attempts. Please try again after 10 minutes."],
    sessionRecreateLimiter: [20, _10Mins, false, true, "Too many session recreation attempts. Please wait 10 minutes."],
    loginLimiter: [15, _10Mins, false, true, "Too many login attempts. Please wait 10 minutes before retrying."],
    googleLimiter: [20, _15Mins, false, true, "Too many Google login attempts. Try again after 15 minutes."],
    githubLimiter: [20, _15Mins, false, true, "Too many GitHub login attempts. Try again after 15 minutes."],
    connectDriveLimiter: [30, _10Mins, true, false, "Too many Drive connection requests. Please wait 10 minutes."],

    // User Routes Limiters
    getAllUsersLimiter: [30, _10Mins, true, false, "Too many requests to fetch users. Try again after 10 minutes."],
    userInfoLimiter: [60, _15Mins, true, false, "Too many requests for user info. Try again later."],
    userLogoutLimiter: [20, _10Mins, true, false, "Too many logout attempts. Please wait 10 minutes."],
    userLogoutAllLimiter: [10, _15Mins, true, false, "Too many logout-all attempts. Please wait 15 minutes."],
    logoutSpecificUserLimiter: [15, _10Mins, true, false, "Too many attempts to logout specific user."],
    softDeleteUserLimiter: [10, _15Mins, true, false, "Too many soft delete requests. Try again later."],
    hardDeleteUserLimiter: [5, _15Mins, true, false, "Too many hard delete requests. Try again later."],
    recoverUserLimiter: [10, _15Mins, true, false, "Too many recover requests. Try again later."],
    userSettingsLimiter: [50, _15Mins, true, false, "Too many requests to settings. Try again later."],
    setPasswordLimiter: [10, _10Mins, true, false, "Too many password set attempts. Try again later."],
    updatePasswordLimiter: [10, _10Mins, true, false, "Too many password update attempts. Try again later."],
    updateProfileLimiter: [20, _15Mins, true, false, "Too many profile update attempts. Try again later."],
    disableUserLimiter: [10, _15Mins, true, false, "Too many disable account requests. Try again later."],
    deleteUserLimiter: [5, _15Mins, true, false, "Too many delete account requests. Try again later."],
    changeRoleLimiter: [10, _15Mins, true, false, "Too many role change requests. Try again later."],
    getSpecificUserDirLimiter: [30, _10Mins, true, false, "Too many directory requests. Try again later."],
    getFileLimiter: [30, _10Mins, true, false, "Too many file requests. Try again later."],

    // Directory Routes Limiters
    getDirLimiter: [60, _10Mins, true, false, "Too many directory fetch requests. Please try again later."],
    createDirLimiter: [25, _10Mins, true, false, "Too many directory creations. Please try again later."],
    updateDirLimiter: [30, _10Mins, true, false, "Too many directory updates. Please try again later."],
    deleteDirLimiter: [15, _10Mins, true, false, "Too many directory deletions. Please try again later."],

    // File Routes Limiters
    fileAccessLimiter: [60, _15Mins, true, false, "Too many file access requests. Please wait 15 minutes."],
    fileUploadLimiter: [60, _10Mins, true, false, "Too many file upload attempts. Please wait 10 minutes."],
    fileDeleteLimiter: [30, _10Mins, true, false, "Too many file deletion attempts. Please wait 10 minutes."],
    fileRenameLimiter: [30, _10Mins, true, false, "Too many file rename attempts. Please wait 10 minutes."],
    shareEmailLimiter: [60, _10Mins, true, false, "Too many email sharing attempts. Please wait 10 minutes."],
    shareLinkLimiter: [60, _10Mins, true, false, "Too many link sharing attempts. Please wait 10 minutes."],
    shareLinkToggleLimiter: [30, _10Mins, true, false, "Too many link toggle attempts. Please wait 10 minutes."],
    sharePermissionLimiter: [30, _10Mins, true, false, "Too many permission change attempts. Please wait 10 minutes."],
    shareAccessListLimiter: [30, _10Mins, true, false, "Too many access list requests. Please wait 10 minutes."],
    shareRevokeAccessLimiter: [30, _10Mins, true, false, "Too many access revocation attempts. Please wait 10 minutes."],
    fileInfoLimiter: [60, _10Mins, true, false, "Too many file info requests. Please wait 10 minutes."],
    dashboardLimiter: [30, _10Mins, true, false, "Too many dashboard requests. Please wait 10 minutes."],
    sharedFilesLimiter: [30, _10Mins, true, false, "Too many shared files requests. Please wait 10 minutes."],
    sharedFileAccessLimiter: [100, _15Mins, false, true, "Too many shared file access attempts. Please wait 15 minutes."],
    editorRenameLimiter: [30, _10Mins, true, false, "Too many editor rename attempts. Please wait 10 minutes."],

    // Guest Routes Limiters
    getFileInfoLimiter: [60, _10Mins, false, true, "Too many attempts to access the file Info. Please wait 10 minutes."],
    fileAccessLimiter: [60, _10Mins, false, true,  "Too many attempts to access the file. Please wait 10 minutes."],
    guestRenameLimiter: [30, _10Mins, false, true, "Too many editor rename attempts. Please wait 10 minutes."],

    // OTP Routes Limiter
    sendOTPLimiter: [40, _15Mins, false, true, "Too many send otp attempts. Please try again after 15 minutes."]
};



export const limiter = Object.fromEntries(
  Object.entries(rateLimiterConfig).map(([key, value]) => [
    key,
    makeLimiter(...value),
  ])
);
