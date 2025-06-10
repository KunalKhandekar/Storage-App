import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { token } = req.signedCookies;
  if (!token) {
    res.cookie("token");
    return res.status(401).json({ error: "Not logged in" });
  }
  const { id, expiry } = JSON.parse(Buffer.from(token, "base64url").toString());

  const cookieDate = new Date(expiry);
  if (cookieDate < Date.now()) {
    res.cookie("token");
    return res.status(401).json({ error: "Not logged in" });
  }

  const user = await User.findById(id);
  if (!user) return res.status(401).json({ error: "Not logged in" });
  req.user = user;
  next();
}
