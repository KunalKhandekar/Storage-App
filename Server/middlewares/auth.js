import redisClient from "../config/redis.js";
import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { token } = req.signedCookies;
  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const session = await redisClient.json.get(`session:${token}`);
  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const user = await User.findById(session.userId).select("-password").lean();

  if (user.isDeleted) {
    return res
      .status(403)
      .json({ message: "User account is deactivated or deleted." });
  }

  req.user = user;
  next();
}
