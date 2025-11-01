import { Router } from "express";
import { razorpayWebhookController } from "../controllers/webhookControllers.js";

const router = Router();

router.post("/razorpay", razorpayWebhookController)

export default router;