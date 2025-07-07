import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

mongoose.connect(process.env.MONGODB_URL);

const seedUsers = async () => {
  try {
    const users = [];

    for (let i = 1; i <= 20; i++) {
      const name = `user${i}`;
      const email = `user${i}@example.com`;
      const password = await bcrypt.hash("123456", 10);
      const rootDirId = new mongoose.Types.ObjectId();

      users.push({
        name,
        email,
        password,
        role: "User",
        isDeleted: false,
        createdWith: "email",
        canLoginWithPassword: true,
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        rootDirId,
      });
    }

    await User.insertMany(users);
    console.log("✅ Dummy users inserted.");
  } catch (error) {
    console.error("❌ Failed to seed users:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();
