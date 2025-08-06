import { Router } from "express";
import multer from "multer";
import {
  changeRole,
  deleteUser,
  disableUser,
  getAllUsers,
  getFile,
  getSettingDetails,
  getSpecificUserDirectory,
  getUserInfo,
  hardDeleteUser,
  logoutAll,
  logoutSpecificUser,
  logoutUser,
  recoverUser,
  setPasswordForManualLogin,
  softDeleteUser,
  updatePassword,
  updateProfile
} from "../controllers/userControllers.js";
import checkAuth from "../middlewares/auth.js";
import { checkRole } from "../middlewares/checkRole.js";
import validateRequest from "../middlewares/validateRequest.js";
import { profileStorage } from "../utils/MulterSetup.js";

const upload = multer({ storage: profileStorage });

const router = Router();

["userId", "dirId", "fileId"].forEach((param) =>
  router.param(param, validateRequest)
);

// GET /user/
// Desc   -> Retrieve authenticated user's information.
router.get("/", checkAuth, getUserInfo);

// POST /user/logout
// Desc   -> Logout the current user from this session.
router.post("/logout", checkAuth, logoutUser);

// POST /user/logout-all
// Desc   -> Logout the user from all devices/sessions.
router.post("/logout-all", checkAuth, logoutAll);

// GET /user/all-users
// Desc   -> Retrieve a list of all users.
// Role   -> SuperAdmin | Admin | Manager only
router.get("/all-users", checkAuth, checkRole, getAllUsers);

// POST /user/:userId/logout
// Desc   -> Logout a specific user.
// Params -> { userId: string }
// Role   -> SuperAdmin | Admin | Manager only
router.post("/:userId/logout", checkAuth, checkRole, logoutSpecificUser);

// DELETE /user/:userId/delete/soft
// Desc   -> Soft delete a user (mark as deleted).
// Params -> { userId: string }
// Role   -> SuperAdmin | Admin Only
router.delete("/:userId/delete/soft", checkAuth, checkRole, softDeleteUser);

// DELETE /user/:userId/delete/hard
// Desc   -> Permanently delete a user from the database.
// Params -> { userId: string }
// Role   -> SuperAdmin Only
router.delete("/:userId/delete/hard", checkAuth, checkRole, hardDeleteUser);

// PATCH /user/:userId/recover
// Desc   -> Recover a soft-deleted user.
// Params -> { userId: string }
// Role   -> SuperAdmin Only
router.patch("/:userId/recover", checkAuth, checkRole, recoverUser);

// GET /user/settings
// Desc   -> Get user settings/details.
router.get("/settings", checkAuth, getSettingDetails);

// PATCH /user/setPassword
// Desc   -> Set a password for manual login (for social accounts).
// Body   -> { password: string }
router.patch("/setPassword", checkAuth, setPasswordForManualLogin);

// PATCH /user/updatePassword
// Desc   -> Update the user's existing password.
// Body   -> { oldPassword: string, newPassword: string }
router.patch("/updatePassword", checkAuth, updatePassword);

// POST /user/updateProfile
// Desc    -> Update user profile information, including profile image.
// Headers -> Content-Type: multipart/form-data
// Body    -> { file: File (profile image) , name: string }
router.post("/updateProfile", checkAuth, upload.single("file"), updateProfile);

// PATCH /user/disable
// Desc   -> Disable the current user's account.
router.patch("/disable", checkAuth, disableUser);

// DELETE /user/delete
// Desc   -> Permanently delete the current user's account.
router.delete("/delete", checkAuth, deleteUser);

// POST /user/:userId/changeRole
// Desc   -> Change the role of a specific user.
// Params -> { userId: string }
// Body   -> { role: string }
// Role   ->  SuperAdmin | Admin | Manager only
router.post("/:userId/changeRole", checkAuth, checkRole, changeRole);

// GET /user/:userId/:dirId
// Desc   -> Get a specific user's directory
// Params -> { userId: string, dirId: string }
// Role   -> SuperAdmin | Admin | Manager Only
router.get("/:userId/{:dirId}", checkAuth, checkRole, getSpecificUserDirectory);

// GET /user/:userId/file/:fileId
// Desc   -> Get a specific file of a user (Admin only).
// Params -> { userId: string, fileId: string }
// Role   -> SuperAdmin | Admin | Manager Only
router.get("/:userId/file/:fileId", checkAuth, checkRole, getFile);

export default router;
