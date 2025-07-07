import { Router } from "express";
import multer from "multer";
import path from "node:path";
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
  loginUser,
  logoutAll,
  logoutSpecificUser,
  logoutUser,
  recoverUser,
  registerUser,
  setPasswordForManualLogin,
  softDeleteUser,
  updatePassword,
  updateProfile,
} from "../controllers/userControllers.js";
import checkAuth from "../middlewares/auth.js";
import { checkRole } from "../middlewares/checkRole.js";
import validateRequest from "../middlewares/validateRequest.js";

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "profilePictures/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomID = crypto.randomUUID();
    const fullFileName = `${randomID}${ext}`;
    file.ext = ext;
    file.storedName = fullFileName;
    cb(null, fullFileName);
  },
});

const upload = multer({ storage: profileStorage });

const router = Router();

router.param("userId", validateRequest);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", checkAuth, getUserInfo);
router.post("/logout", checkAuth, logoutUser);
router.post("/logout-all", checkAuth, logoutAll);
router.get("/all-users", checkAuth, checkRole, getAllUsers);
router.post("/:userId/logout", checkAuth, checkRole, logoutSpecificUser);
router.delete("/:userId/delete/soft", checkAuth, checkRole, softDeleteUser);
router.delete("/:userId/delete/hard", checkAuth, checkRole, hardDeleteUser);
router.patch("/:userId/recover", checkAuth, checkRole, recoverUser);
router.get("/settings", checkAuth, getSettingDetails);
router.patch("/setPassword", checkAuth, setPasswordForManualLogin);
router.patch("/updatePassword", checkAuth, updatePassword);
router.post("/updateProfile", checkAuth, upload.single("file"), updateProfile);
router.patch("/disable", checkAuth, disableUser);
router.delete("/delete", checkAuth, deleteUser);
router.post("/:userId/changeRole", checkAuth, checkRole, changeRole);

router.get("/:userId/{:dirId}", checkAuth, checkRole, getSpecificUserDirectory);
router.get("/:userId/file/:fileId", checkAuth, checkRole, getFile);

export default router;
