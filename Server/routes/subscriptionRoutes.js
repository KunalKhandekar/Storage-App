import express from "express";
import { cancelSubscription, changePlan, checkSubscripitonStatus, createSubscription, plansEligibleforChange } from "../controllers/subscriptionControllers.js";

// Subscription Router
const router = express.Router();

// Create Subscription
router.post("/create", createSubscription);

// Check subscription status
router.get("/status", checkSubscripitonStatus);

// Cancel the subscription & revoke the access.
router.delete("/cancel", cancelSubscription)

// Change plan (Downgrade || Upgrade)
router.post("/changePlan", changePlan);

router.get("/change-eligibility", plansEligibleforChange)

export default router;
