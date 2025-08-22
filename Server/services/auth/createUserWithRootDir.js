import { Types } from "mongoose";
import Directory from "../../models/dirModel.js";
import User from "../../models/userModel.js";

export const createUserWithRootDir = async (
  name,
  email,
  canLoginWithPassword,
  createdWith,
  session,
  password, // optional for social logins,
  picture, // optional for normal login.
) => {
  const rootDirId = new Types.ObjectId();
  const userId = new Types.ObjectId();

  await Directory.create(
    [
      {
        _id: rootDirId,
        name: `root-${email}`,
        userId,
        parentDirId: null,
        path: [rootDirId],
      },
    ],
    { session }
  );

  const userPayload = {
    _id: userId,
    name,
    email,
    rootDirId,
    canLoginWithPassword,
    createdWith,
    ...(password && { password }),
    ...(picture && { picture }),
  };

  await User.create([userPayload], { session });

  return userId;
};
