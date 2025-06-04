import { Router } from "express";
import checkAuth from "../middlewares/auth.js";
import {
  getUserInfo,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userControllers.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", checkAuth, getUserInfo);

router.post("/logout", logoutUser);

export default router;
