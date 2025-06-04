import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import checkAuth from "./middlewares/auth.js";
import dirRoutes from "./routes/dirRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";

export const absolutePath = import.meta.dirname + "/storage/";

await connectDB();

const app = express();
const port = 4000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/file", checkAuth, fileRoutes);
app.use("/directory", checkAuth, dirRoutes);
app.use("/user", userRoutes);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: "Something Went wrong" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
