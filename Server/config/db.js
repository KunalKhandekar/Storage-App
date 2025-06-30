import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
    console.log("Could Not Connect to the Database");
    process.exit(1);
  }
}

// It doesn't work with --watch command
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Database Disconnected!");
  process.exit(0);
});