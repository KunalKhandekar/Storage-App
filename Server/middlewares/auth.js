import Session from "../models/SessionModel.js";

export default async function checkAuth(req, res, next) {
  const { token } = req.signedCookies;
  if (!token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const session = await Session.findOne({ _id: token }).populate("userId");
  if (!session) {
    return res.status(401).json({ error: "Not logged in" });
  }
  const user = session.userId;

  if (user.isDeleted) {
    return res
      .status(403)
      .json({ message: "User account is deactivated or deleted." });
  };
  
  req.user = user;
  next();
}
