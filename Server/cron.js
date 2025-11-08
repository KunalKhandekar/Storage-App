import cron from "node-cron";
import { cleanOldLogs } from "./services/logService.js";

// Runs every night at 12:00 AM
cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      console.log("Running log cleanup task...");
      await cleanOldLogs();
      console.log("Cleanup done ✅");
    } catch (err) {
      console.error("Cron job error:", err);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // important for consistency
  }
);
