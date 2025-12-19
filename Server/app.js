// Required Packages
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { StatusCodes } from "http-status-codes";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import dirRoutes from "./routes/dirRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

// Middleware & Utilities
import checkAuth from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { secretKey } from "./utils/Constants.js";

// Database Connection
import { connectDB } from "./config/db.js";

// Security Imports
import helmet from "helmet";
import { startCronJobs } from "./cron/index.js";
import { eventController } from "./controllers/EventController.js";
import CustomSuccess from "./utils/SuccessResponse.js";

// controllers
import { verifySubscriptionId } from "./controllers/subscriptionControllers.js";

// Connect to MongoDB
await connectDB();

export const rootPath = import.meta.dirname;

// Create Express App
const app = express();
const allowedOrigins = process.env.CLIENT_URLS.split(",").map((url) =>
  url.trim()
);

// Adding Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
    contentSecurityPolicy: {
      directives: {
        reportUri: ["/csp-violation-report"],
        frameAncestors: ["'self'", ...allowedOrigins],
      },
    },
  })
);

// Header Violation End-point
app.post(
  "/csp-violation-report",
  express.json({ type: "application/csp-report" }),
  (req, res) => {
    console.log("CSP violation by client: ", req.body);
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }
);

// Global RateLimiting -> 250 Reqs / 15 mins / IP
// app.use(RateLimiter());

// Middlewares
app.use("/profilePictures", express.static("profilePictures"));
app.use(express.json());
app.use(cookieParser(secretKey));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Protected Routes
app.use("/subscription", checkAuth, subscriptionRoutes);
app.use("/file", checkAuth, fileRoutes);
app.use("/directory", checkAuth, dirRoutes);
app.use("/user", checkAuth, userRoutes);

// Public Routes
app.use("/otp", otpRoutes);
app.use("/auth", authRoutes);
app.use("/guest", guestRoutes);
app.use("/webhook", webhookRoutes);
app.use("/events", eventController);

// Verify subscription id route
app.use("/verify-subscription", verifySubscriptionId);

app.get("/", (req, res) => {
  return CustomSuccess.send(res, "App working fine & Implementing Custom CI CD", StatusCodes.OK);
});

// Error Handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
  startCronJobs();
});
