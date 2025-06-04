import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(
    "mongodb://admin:admin@localhost:27017/StorageApp?replicaSet=rs0&authSource=admin"
  );
  console.log("DB Connected");
};

process.on("SIGINT", async () => {
  await client.close();
  console.log("Client Disconnected");
  process.exit(0);
});
