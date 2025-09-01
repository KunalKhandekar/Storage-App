// Required Packages
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

// Middleware & Utilities
import checkAuth from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { secretKey } from "./utils/Constants.js";

// Database Connection
import { connectDB } from "./config/db.js";

// Security Imports
import helmet from "helmet";

// Connect to MongoDB
await connectDB();

export const rootPath = import.meta.dirname;

// Create Express App
const app = express();

// Adding Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
    contentSecurityPolicy: {
      directives: {
        reportUri: ["/csp-violation-report"],
        frameAncestors: [
          "'self'",
          process.env.CLIENT_URL,
          "http://192.168.0.107:5173",
          "http://172.27.192.1:5173",
        ],
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
    origin: [
      process.env.CLIENT_URL,
      "http://192.168.0.107:5173",
      "http://172.27.192.1:5173",
    ],
    credentials: true,
  })
);

// Protected Routes
app.use("/file", checkAuth, fileRoutes);
app.use("/directory", checkAuth, dirRoutes);
app.use("/user", checkAuth, userRoutes);

// Public Routes
app.use("/otp", otpRoutes);
app.use("/auth", authRoutes);
app.use("/guest", guestRoutes);

// Error Handler
app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
