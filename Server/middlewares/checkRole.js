export const checkRole = (req, res, next) => {
  if (req.user.role !== "User") return next();

  return res
    .status(403)
    .json({ message: "You are not authorized to access this route." });
};
