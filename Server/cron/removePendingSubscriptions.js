import cron from "node-cron";
import Subscription from "../models/subscriptionModel.js";

// Will check for subscriptions with pending status which exceeds the limit of updatedAt more than 12 hours.
export const removePendingSubscriptionsFromDatabase = () => {
  cron.schedule(
    "0 */6 * * *", // every 6 hours (00:00, 06:00, 12:00, 18:00)
    async () => {
      try {
        const _12HoursBefore = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago
        const result = await Subscription.deleteMany({
          status: "pending", // only pending subscriptions
          updatedAt: { $lt: _12HoursBefore }, // older than 12 hours
        });

        console.log(`🧹 Deleted ${result.deletedCount} pending subscriptions older than 12 hours`);
      } catch (err) {
        console.error("Cron job error:", err);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};
