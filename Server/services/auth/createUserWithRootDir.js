import { Types } from "mongoose";
import Directory from "../../models/dirModel.js";
import User from "../../models/userModel.js";

export const createUserWithRootDir = async (
  name,
  email,
  password,
  canLoginWithPassword,
  createdWith,
  session
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
      },
    ],
    { session }
  );

  await User.create(
    [
      {
        _id: userId,
        name,
        email,
        password,
        rootDirId,
        canLoginWithPassword,
        createdWith,
      },
    ],
    { session }
  );
};
