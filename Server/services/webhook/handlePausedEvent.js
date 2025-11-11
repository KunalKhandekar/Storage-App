import redisClient from "../../config/redis.js";
import User from "../../models/userModel.js";


export default async function handlePausedEvent(eventBody) {
  const webhookSubscription = eventBody.payload.subscription.entity;
  const userId = webhookSubscription.notes.userId;

  const user = await User.findById(userId);
  if (!user) {
    return "User not found, webhook ignored";
  }

  try {
    await redisClient.deleteManySessions(user._id);
  } catch (error) {
    console.error("Error deleting user sessions:", error);
  }

  if (user.isDeleted) {
    return "User already disabled, webhook ignored";
  }

  user.isDeleted = true;
  await user.save();
  return "User disabled successfully";
}