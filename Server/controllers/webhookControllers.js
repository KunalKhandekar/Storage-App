import { StatusCodes } from "http-status-codes";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import Webhook from "../models/razorpayWebhookModel.js";
import { WebhookServices } from "../services/index.js";
import CustomError from "../utils/ErrorResponse.js";

export const razorpayWebhookController = async (req, res, next) => {
  try {
    const webhookBody = req.body;
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
 
    const isValidRequest = validateWebhookSignature(
      JSON.stringify(webhookBody),
      webhookSignature,
      webhookSecret
    );

    if (!isValidRequest) {
      throw new CustomError("Invalid signature", StatusCodes.BAD_REQUEST);
    }

    const event = webhookBody?.event;


    const webhookDoc = await Webhook.create({
      eventType: event,
      signature: webhookSignature,
      payload: webhookBody,
      status: "pending",
    });

    const message = await WebhookServices.RazorpayEventHandler(event, webhookBody);

    webhookDoc.status = "processed";
    webhookDoc.responseMessage = message;
    webhookDoc.processedAt = new Date();
    await webhookDoc.save();

    res.status(StatusCodes.OK).send("Webhook processed successfully");
  } catch (error) {
    console.error("Razorpay Webhook Error:", error);
    next(error);
  }
};
