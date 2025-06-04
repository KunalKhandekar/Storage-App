import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { uid } = req.cookies;
  if (!uid) return res.status(401).json({ error: "Not logged in" });
  const user = await User.findOne({ _id: uid });
  if (!user) return res.status(401).json({ error: "Not logged in" });
  req.user = user;
  next();
}
