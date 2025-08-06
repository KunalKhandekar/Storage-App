// Required Packages
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Route Imports
import dirRoutes from "./routes/dirRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";

// Middleware & Utilities
import checkAuth from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { port, secretKey } from "./utils/Constants.js";

// Database Connection
import { connectDB } from "./config/db.js";

// Connect to MongoDB
await connectDB();

export const absolutePath = import.meta.dirname + "/storage/";
export const rootPath = import.meta.dirname;

// Create Express App
const app = express();

// Middlewares
app.use("/profilePictures", express.static("profilePictures"));
app.use(express.json());
app.use(cookieParser(secretKey));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

// Protected Routes
app.use("/file", checkAuth, fileRoutes);
app.use("/directory", checkAuth, dirRoutes);

// Public Routes
app.use("/user", userRoutes);
app.use("/otp", otpRoutes);
app.use("/auth", authRoutes);
app.use("/guest", guestRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
