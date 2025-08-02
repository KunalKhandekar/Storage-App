import crypto from "crypto";
import { Router } from "express";
import multer from "multer";
import path from "path";
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
  renameFileByEditor,
  revokeUserAccess,
  shareLinkToggle,
  shareViaEmail,
  shareViaLink,
  uploadFile,
} from "../controllers/fileControllers.js";
import { checkFileAccess } from "../middlewares/checkFileAccess.js";
import { serveFile } from "../middlewares/serveFile.js";
import validateRequest from "../middlewares/validateRequest.js";
import { checkFileShared } from "../middlewares/checkFIleShared.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "storage/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomID = crypto.randomUUID();
    const fullFileName = `${randomID}${ext}`;
    file.ext = ext;
    file.storedName = fullFileName;
    cb(null, fullFileName);
  },
});

const upload = multer({ storage });
const router = Router();

router.param("id", validateRequest);
router.param("fileId", validateRequest);
router.param("userId", validateRequest);

// GET file
router.get("/:id", getFileById, serveFile);

// UPLOAD file(s)
router.post("/upload", upload.single("myfiles"), uploadFile);

// DELETE file
router.delete("/:id", deleteFile);

// PATCH (rename) file
router.patch("/:id", renameFile);

// Share File Routes
router.post("/share/:fileId/email", checkFileAccess, shareViaEmail);
router.post("/share/:fileId/link", checkFileAccess, shareViaLink);
router.patch("/share/:fileId/link/toggle", checkFileAccess, shareLinkToggle);
router.patch(
  "/share/:fileId/link/permission",
  checkFileAccess,
  changePermission
);

router.get("/share/access/:fileId/link", getSharedFileViaLink, serveFile);
router.get("/share/access/:fileId/email", getSharedFileViaEmail, serveFile);
router.get("/share/access/:fileId/list", checkFileAccess, getUserAccessList);
router.get("/share/dashboard", getDashboardInfo);
router.get("/share/by-me", getSharedByMeFiles);
router.get("/share/with-me", getSharedWithMeFiles);
router.get("/info/:fileId", checkFileAccess, getFileInfoById);

// Update Permission.
router.patch(
  "/share/update/permission/:userId/:fileId",
  changePermissionOfUser
);
// Revoke Access.
router.patch("/share/access/revoke/:userId/:fileId", revokeUserAccess);

// Editor -> Rename file
router.patch("/share/edit/:fileId", checkFileShared, renameFileByEditor);

export default router;
