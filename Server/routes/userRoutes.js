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
import validateRequest from "../middlewares/validateRequest.js";

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


export default router;
