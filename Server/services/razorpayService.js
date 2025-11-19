import Razorpay from "razorpay";

const env = process.env.PAYMENT_ENV;

export const razorpayInstance = new Razorpay({
  key_id: env === "test" ? process.env.RAZORPAY_TEST_KEY_ID : process.env.RAZORPAY_LIVE_KEY_ID,
  key_secret: env === "test" ? process.env.RAZORPAY_TEST_KEY_SECRET : process.env.RAZORPAY_LIVE_KEY_SECRET,
});