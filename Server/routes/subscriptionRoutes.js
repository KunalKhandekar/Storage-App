import express from "express";
import { createSubscription } from "../controllers/subscriptionControllers.js";

const router = express.Router();

// Subscription Routes
router.post("/create", createSubscription);

export default router;
