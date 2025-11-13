export const setCookie = (res, sessionID, sessionExpiry) => {
  res.cookie("token", sessionID, {
    httpOnly: true,
    signed: true,
    maxAge: sessionExpiry,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
};
