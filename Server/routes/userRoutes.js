import { Router } from "express";
import checkAuth from "../middlewares/auth.js";
import {
  DeleteSpecificUser,
  getAllUsers,
  getSettingDetails,
  getUserInfo,
  loginUser,
  logoutAll,
  logoutSpecificUser,
  logoutUser,
  registerUser,
  setPasswordForManualLogin,
  updatePassword,
  updateProfile,
} from "../controllers/userControllers.js";
import { checkRole } from "../middlewares/checkRole.js";
import validateRequest from "../middlewares/validateRequest.js";
import path from "node:path";
import multer from "multer";

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
router.delete("/:userId/delete", checkAuth, checkRole, DeleteSpecificUser);
router.get("/settings", checkAuth, getSettingDetails);
router.patch("/setPassword", checkAuth, setPasswordForManualLogin);
router.patch("/updatePassword", checkAuth, updatePassword);
router.post("/updateProfile", checkAuth, upload.single("file"), updateProfile);

export default router;
