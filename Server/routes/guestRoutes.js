import { Router } from "express";
import {
  getFileInfoAndURL,
  getSharedFileViaLink,
  renameFileSharedViaLink,
} from "../controllers/fileControllers.js";
import { serveFile } from "../middlewares/serveFile.js";
import { limiter } from "../utils/RateLimiter.js";
import { checkFileSharedViaLink } from "../middlewares/checkFileShared.js";

const router = Router();

// ---------------- Guest Routes -------------------------

// GET /guest/file/:fileId
// Desc -> Retrieve file information and URL for displaying file preview.
// Params -> { fileId }
router.get("/file/:fileId", limiter.getFileInfoLimiter, getFileInfoAndURL);

// Note: Google-hosted files cannot be served directly (Unauthorized).

// GET /guest/file/view/:fileId
// Desc -> Serve a file via a public link.
// Params -> { fileId }
// Query -> { token: string }
router.get("/file/view/:fileId", limiter.fileAccessLimiter, getSharedFileViaLink, serveFile);

// PATCH /guest/share/edit/:fileId/link
// Desc -> Rename a file shared through Link (allowed for editors).
// Params -> { fileId }
// Body -> { name: string }
router.patch(
  "/share/edit/:fileId/link",
  limiter.guestRenameLimiter,
  checkFileSharedViaLink,
  renameFileSharedViaLink
);

export default router;
