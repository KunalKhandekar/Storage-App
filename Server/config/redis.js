import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URI,
  socket: {
    connectTimeout: 10000, // 10s timeout
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis reconnect failed after 5 retries");
        return new Error("Redis reconnet failed");
      }
      console.log(`🔁 Redis retry #${retries}`);
      return 1000 * retries;
    },
  },
});

// Handle connection errors gracefully
redisClient.on("error", (err) => {
  console.error("❗ Redis Client Error:", err.message);
  // Do not exit here; let reconnectStrategy try to recover
});

// Initial connection
try {
  await redisClient.connect();
  console.log("✅ Redis Connected");
} catch (err) {
  console.error("Initial Redis connection failed:", err.message);
}

// Custom function to delete multiple sessions by userId
redisClient.deleteManySessions = async function (userId) {
  try {
    const userSessions = await this.ft.search(
      "userIdIdx",
      `@userId:{${userId}}`,
      { RETURN: [] }
    );

    for (const { id } of userSessions.documents) {
      await this.del(id);
    }
  } catch (err) {
    console.error("Error deleting sessions for user:", err.message);
  }
};

// Custom function to count redis user Sessions by userId
redisClient.countUserSessions = async function (userId) {
  try {
    const result = await this.ft.search("userIdIdx", `@userId:{${userId}}`, {
      LIMIT: { from: 0, size: 0 },
    });
    return result.total;
  } catch (error) {
    console.error("Error counting sessions of user:", error.message);
  }
};

export default redisClient;
