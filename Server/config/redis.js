import { createClient } from "redis";

const redisClient = await createClient()
  .on("error", (err) => {
    console.log("Redis Client Error, ", err);
    process.exit(1);
  })
  .connect();

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
