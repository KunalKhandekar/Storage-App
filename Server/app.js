import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import checkAuth from "./middlewares/auth.js";
import dirRoutes from "./routes/dirRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const absolutePath = import.meta.dirname + "/storage/";
const secretKey = process.env.COOKIE_SECRET;

await connectDB();

const app = express();
const port = process.env.PORT || 4000;
app.use("/profilePictures", express.static("profilePictures"));
app.use(express.json());
app.use(cookieParser(secretKey));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use("/file", checkAuth, fileRoutes);
app.use("/directory", checkAuth, dirRoutes);
app.use("/user", userRoutes);
app.use("/otp", otpRoutes);
app.use("/auth", authRoutes);

// Error Handler Middleware with Custom Error Class.
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});