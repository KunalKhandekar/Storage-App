import { Router } from "express";
import {
  getFileInfoAndURL,
  getSharedFileViaLink,
  renameFileSharedViaLink,
} from "../controllers/fileControllers.js";
import { serveFile } from "../middlewares/serveFile.js";
import { limiter } from "../utils/RateLimiter.js";
import { throttler } from "../utils/Throttler.js";
import { checkFileSharedViaLink } from "../middlewares/checkFileShared.js";

const router = Router();

// ---------------- Guest Routes -------------------------

// GET /guest/file/:fileId
// Desc -> Retrieve file information and URL for displaying file preview.
// Params -> { fileId }
router.get(
  "/file/:fileId",
  limiter.getFileInfoLimiter,
  throttler.getFileInfoThrottler,
  getFileInfoAndURL
);

// GET /guest/file/view/:fileId
// Desc -> Serve a file via a public link.
// Params -> { fileId }
// Query -> { token: string }
router.get(
  "/file/view/:fileId",
  limiter.fileAccessLimiter,
  throttler.guestFileAccessThrottler,
  getSharedFileViaLink,
  serveFile
);

// PATCH /guest/share/edit/:fileId/link
// Desc -> Rename a file shared through Link (allowed for editors).
// Params -> { fileId }
// Body -> { name: string }
router.patch(
  "/share/edit/:fileId/link",
  limiter.guestRenameLimiter,
  throttler.guestRenameThrottler,
  checkFileSharedViaLink,
  renameFileSharedViaLink
);

export default router;
