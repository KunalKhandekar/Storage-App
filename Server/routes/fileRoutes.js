import { Router } from "express";
import multer from "multer";
import {
  changePermission,
  changePermissionOfUser,
  deleteFile,
  getDashboardInfo,
  getFileById,
  getFileInfoById,
  getSharedByMeFiles,
  getSharedFileViaEmail,
  getSharedFileViaLink,
  getSharedWithMeFiles,
  getUserAccessList,
  renameFile,
  renameFileSharedViaEmail,
  renameFileSharedViaLink,
  revokeUserAccess,
  shareLinkToggle,
  shareViaEmail,
  shareViaLink,
  uploadFile,
} from "../controllers/fileControllers.js";
import { checkFileAccess } from "../middlewares/checkFileAccess.js";
import {
  checkFileSharedViaEmail,
  checkFileSharedViaLink,
} from "../middlewares/checkFileShared.js";
import { serveFile } from "../middlewares/serveFile.js";
import validateRequest from "../middlewares/validateRequest.js";
import { fileStorage } from "../utils/MulterSetup.js";

// Import the limiters, Throttlers
import { limiter } from "../utils/RateLimiter.js";
import { throttler } from "../utils/Throttler.js";

// Multer Instance for file uploading
const upload = multer({ storage: fileStorage });
const router = Router();

["id", "fileId", "userId"].forEach((param) =>
  router.param(param, validateRequest)
);

// GET /file/:id
// Desc -> Retrieve a file by ID.
// Params -> { id }
router.get(
  "/:id",
  limiter.fileAccessLimiter,
  throttler.fileAccessThrottler,
  getFileById,
  serveFile
);

// POST /file/upload
// Desc -> Upload a file.
// Content-Type -> multipart/form-data
router.post(
  "/upload",
  limiter.fileUploadLimiter,
  upload.single("myfiles"),
  uploadFile
);

// DELETE /file/:id
// Desc -> Delete a file by ID.
// Params -> { id }
router.delete("/:id", limiter.fileDeleteLimiter, deleteFile);

// PATCH /file/:id
// Desc -> Rename a file.
// Params -> { id }
// Body -> { name: string }
router.patch(
  "/:id",
  limiter.fileRenameLimiter,
  throttler.fileRenameThrottler,
  renameFile
);

// ---------------- File Sharing Routes (Owner Only) -------------------------

// POST /file/share/:fileId/email
// Desc -> Share a file with multiple users via email.
// Params -> { fileId }
// Body -> { users: string[] }
router.post(
  "/share/:fileId/email",
  limiter.shareEmailLimiter,
  checkFileAccess,
  shareViaEmail
);

// POST /file/share/:fileId/link
// Desc -> Share a file via public link.
// Params -> { fileId }
// Body -> { permission: string }
router.post(
  "/share/:fileId/link",
  limiter.shareLinkLimiter,
  checkFileAccess,
  shareViaLink
);

// PATCH /file/share/:fileId/link/toggle
// Desc -> Enable or disable public link sharing.
// Params -> { fileId }
// Body -> { enabled: boolean }
router.patch(
  "/share/:fileId/link/toggle",
  limiter.shareLinkToggleLimiter,
  throttler.shareLinkToggleThrottler,
  checkFileAccess,
  shareLinkToggle
);

// PATCH /file/share/:fileId/link/permission
// Desc -> Change permission level for public link access.
// Params -> { fileId }
// Body -> { permission: string }
router.patch(
  "/share/:fileId/link/permission",
  limiter.sharePermissionLimiter,
  throttler.sharePermissionThrottler,
  checkFileAccess,
  changePermission
);

// GET /file/share/access/:fileId/list
// Desc -> Retrieve the list of users who have access to the file.
// Params -> { fileId }
router.get(
  "/share/access/:fileId/list",
  limiter.shareAccessListLimiter,
  throttler.shareAccessListThrottler,
  checkFileAccess,
  getUserAccessList
);

// GET /file/info/:fileId
// Desc -> Retrieve detailed file information.
// Params -> { fileId }
router.get(
  "/info/:fileId",
  limiter.fileInfoLimiter,
  throttler.fileInfoThrottler,
  checkFileAccess,
  getFileInfoById
);

// PATCH /file/share/update/permission/:userId/:fileId
// Desc -> Update the permission of a shared user.
// Params -> { fileId, userId }
// Body -> { permission: string }
router.patch(
  "/share/update/permission/:userId/:fileId",
  limiter.sharePermissionLimiter,
  checkFileAccess,
  changePermissionOfUser
);

// PATCH /file/share/access/revoke/:userId/:fileId
// Desc -> Revoke access from a shared user.
// Params -> { fileId, userId }
router.patch(
  "/share/access/revoke/:userId/:fileId",
  limiter.shareRevokeAccessLimiter,
  checkFileAccess,
  revokeUserAccess
);

// ---------------- File Accessing Routes -------------------------

// GET /file/share/access/:fileId/link
// Desc -> Access a shared file via public link.
// Params -> { fileId }
// Query -> { token: string }
router.get(
  "/share/access/:fileId/link",
  limiter.sharedFileAccessLimiter,
  getSharedFileViaLink,
  serveFile
);

// GET /file/share/access/:fileId/email
// Desc -> Access a shared file via email share.
// Params -> { fileId }
router.get(
  "/share/access/:fileId/email",
  limiter.sharedFileAccessLimiter,
  getSharedFileViaEmail,
  serveFile
);

// GET /file/share/dashboard
// Desc -> Retrieve sharing dashboard information (totals, recent shares).
router.get(
  "/share/dashboard",
  limiter.dashboardLimiter,
  throttler.dashboardThrottler,
  getDashboardInfo
);

// GET /file/share/by-me
// Desc -> Retrieve files shared by the current user.
router.get(
  "/share/by-me",
  limiter.sharedFilesLimiter,
  throttler.sharedFilesThrottler,
  getSharedByMeFiles
);

// GET /file/share/with-me
// Desc -> Retrieve files shared with the current user.
router.get(
  "/share/with-me",
  limiter.sharedFilesLimiter,
  throttler.sharedFilesThrottler,
  getSharedWithMeFiles
);

// ---------------- Editor Routes -------------------------

// PATCH /file/share/edit/:fileId
// Desc -> Rename a file shared through Mail (allowed for editors).
// Params -> { fileId }
// Body -> { name: string }
router.patch(
  "/share/edit/:fileId",
  limiter.editorRenameLimiter,
  throttler.editorRenameThrottler,
  checkFileSharedViaEmail,
  renameFileSharedViaEmail
);

export default router;
