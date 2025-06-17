import { Router } from "express";
import checkAuth from "../middlewares/auth.js";
import {
  DeleteSpecificUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutAll,
  logoutSpecificUser,
  logoutUser,
  registerUser,
} from "../controllers/userControllers.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", checkAuth, getUserInfo);
router.post("/logout", checkAuth, logoutUser);
router.post("/logout-all", checkAuth, logoutAll);
router.get("/all-users", checkAuth, checkRole, getAllUsers);
router.post("/:userId/logout", checkAuth, checkRole, logoutSpecificUser);
router.delete("/:userId/delete", checkAuth, checkRole, DeleteSpecificUser);


export default router;
