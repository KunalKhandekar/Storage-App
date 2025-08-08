export const setCookie = (res, sessionID, sessionExpiry) => {
  res.cookie("token", sessionID, {
    httpOnly: true,
    signed: true,
    maxAge: sessionExpiry,
  });
  console.log({ sessionID, sessionExpiry });
  console.log("Cookie Set..");
};
