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
  uploadFile
} from "../controllers/fileControllers.js";
import { checkFileAccess } from "../middlewares/checkFileAccess.js";
import { checkFileSharedViaEmail, checkFileSharedViaLink } from "../middlewares/checkFileShared.js";
import { serveFile } from "../middlewares/serveFile.js";
import validateRequest from "../middlewares/validateRequest.js";
import { fileStorage } from "../utils/MulterSetup.js";

// Multer Instance for file uploading
const upload = multer({ storage: fileStorage });
const router = Router();

["id", "fileId", "userId"].forEach((param) =>
  router.param(param, validateRequest)
);

// GET /file/:id
// Desc -> Retrieve a file by ID.
// Params -> { id }
router.get("/:id", getFileById, serveFile);

// POST /file/upload
// Desc -> Upload a file.
// Content-Type -> multipart/form-data
router.post("/upload", upload.single("myfiles"), uploadFile);

// DELETE /file/:id
// Desc -> Delete a file by ID.
// Params -> { id }
router.delete("/:id", deleteFile);

// PATCH /file/:id
// Desc -> Rename a file.
// Params -> { id }
// Body -> { name: string }
router.patch("/:id", renameFile);

// ---------------- File Sharing Routes (Owner Only) -------------------------

// POST /file/share/:fileId/email
// Desc -> Share a file with multiple users via email.
// Params -> { fileId }
// Body -> { users: string[] }
router.post("/share/:fileId/email", checkFileAccess, shareViaEmail);

// POST /file/share/:fileId/link
// Desc -> Share a file via public link.
// Params -> { fileId }
// Body -> { permission: string }
router.post("/share/:fileId/link", checkFileAccess, shareViaLink);

// PATCH /file/share/:fileId/link/toggle
// Desc -> Enable or disable public link sharing.
// Params -> { fileId }
// Body -> { enabled: boolean }
router.patch("/share/:fileId/link/toggle", checkFileAccess, shareLinkToggle);

// PATCH /file/share/:fileId/link/permission
// Desc -> Change permission level for public link access.
// Params -> { fileId }
// Body -> { permission: string }
router.patch(
  "/share/:fileId/link/permission",
  checkFileAccess,
  changePermission
);

// GET /file/share/access/:fileId/list
// Desc -> Retrieve the list of users who have access to the file.
// Params -> { fileId }
router.get("/share/access/:fileId/list", checkFileAccess, getUserAccessList);

// GET /file/info/:fileId
// Desc -> Retrieve detailed file information.
// Params -> { fileId }
router.get("/info/:fileId", checkFileAccess, getFileInfoById);

// PATCH /file/share/update/permission/:userId/:fileId
// Desc -> Update the permission of a shared user.
// Params -> { fileId, userId }
// Body -> { permission: string }
router.patch(
  "/share/update/permission/:userId/:fileId",
  checkFileAccess,
  changePermissionOfUser
);

// PATCH /file/share/access/revoke/:userId/:fileId
// Desc -> Revoke access from a shared user.
// Params -> { fileId, userId }
router.patch(
  "/share/access/revoke/:userId/:fileId",
  checkFileAccess,
  revokeUserAccess
);

// ---------------- File Accessing Routes -------------------------

// GET /file/share/access/:fileId/link
// Desc -> Access a shared file via public link.
// Params -> { fileId }
// Query -> { token: string }
router.get("/share/access/:fileId/link", getSharedFileViaLink, serveFile);

// GET /file/share/access/:fileId/email
// Desc -> Access a shared file via email share.
// Params -> { fileId }
router.get("/share/access/:fileId/email", getSharedFileViaEmail, serveFile);

// GET /file/share/dashboard
// Desc -> Retrieve sharing dashboard information (totals, recent shares).
router.get("/share/dashboard", getDashboardInfo);

// GET /file/share/by-me
// Desc -> Retrieve files shared by the current user.
router.get("/share/by-me", getSharedByMeFiles);

// GET /file/share/with-me
// Desc -> Retrieve files shared with the current user.
router.get("/share/with-me", getSharedWithMeFiles);

// ---------------- Editor Routes -------------------------

// PATCH /file/share/edit/:fileId
// Desc -> Rename a file shared through Mail (allowed for editors).
// Params -> { fileId }
// Body -> { name: string }
router.patch("/share/edit/:fileId", checkFileSharedViaEmail, renameFileSharedViaEmail);

// PATCH /file/share/edit/:fileId/link
// Desc -> Rename a file shared through Link (allowed for editors).
// Params -> { fileId }
// Body -> { name: string }
router.patch("/share/edit/:fileId/link", checkFileSharedViaLink, renameFileSharedViaLink)

export default router;
