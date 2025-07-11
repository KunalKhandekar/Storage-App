import { createClient } from "redis";

const redisClient = await createClient({url: "redis://localhost:6379"})
  .on("error", (err) => {
    console.log("Redis Client Error, ", err);
    process.exit(1);
  })
  .connect();

  // Custom method for deleting many sessions.
redisClient.deleteManySessions = async function (userId) {
  const userSessions = await this.ft.search(
    "userIdIdx",
    `@userId:{${userId}}`,
    {
      RETURN: [],
    }
  );

  for (const { id } of userSessions.documents) {
    await this.del(id);
  }
};

export default redisClient;
