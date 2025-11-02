import express from "express";
import { checkSubscripitonStatus, createSubscription } from "../controllers/subscriptionControllers.js";

// Subscription Router
const router = express.Router();

// Create Subscription
router.post("/create", createSubscription);

// Check subscription status
router.get("/status", checkSubscripitonStatus);

export default router;
