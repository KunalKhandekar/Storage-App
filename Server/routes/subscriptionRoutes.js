import express from "express";
import { cancelSubscription, checkSubscripitonStatus, createSubscription } from "../controllers/subscriptionControllers.js";

// Subscription Router
const router = express.Router();

// Create Subscription
router.post("/create", createSubscription);

// Check subscription status
router.get("/status", checkSubscripitonStatus);

// Cancel the subscription & revoke the access.
router.delete("/cancel", cancelSubscription)

export default router;
