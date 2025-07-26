// redisClient.js
import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://127.0.0.1:6379",
  socket: {
    connectTimeout: 10000, // increase timeout
    reconnectStrategy: (retries) => {
      if (retries > 5) return new Error("Redis reconnect failed");
      return 1000 * retries; // wait 1s, 2s, 3s...
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
  process.exit(1);
});

await redisClient.connect();
console.log("Redis Connected");

redisClient.deleteManySessions = async function (userId) {
  const userSessions = await this.ft.search(
    "userIdIdx",
    `@userId:{${userId}}`,
    { RETURN: [] }
  );

  for (const { id } of userSessions.documents) {
    await this.del(id);
  }
};

export default redisClient;
