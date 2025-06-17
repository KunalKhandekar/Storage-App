import mongoose, { Types } from "mongoose";
import {
  clientID,
  verifyGoogleIdToken,
} from "../services/googleAuthService.js";
import Directory from "../models/dirModel.js";
import User from "../models/userModel.js";
import Session from "../models/SessionModel.js";

export const loginWithGoogle = async (req, res, next) => {
  const IdToken = req.body.credential;
  const userData = await verifyGoogleIdToken(IdToken, clientID);
  const { email, name, picture, sub } = userData;
  const mongooseSession = await mongoose.startSession();

  try {
    const userFound = await User.findOne({ email });
    if (userFound) {
        console.log({ userFound, condition: !userFound.picture.includes("googleusercontent.com") })
      if (!userFound.picture.includes("googleusercontent.com")) {
        userFound.picture = picture;
        await userFound.save();
      }
      const userSessions = await Session.find({ userId: userFound._id });

      if (userSessions.length >= 2) {
        let smallestValue = Infinity;
        userSessions.forEach((session) => {
          if (session.createdAt < smallestValue) {
            smallestValue = session.createdAt;
          }
        });
        await Session.deleteOne({ createdAt: smallestValue });
      }

      const session = await Session.create({ userId: userFound._id });

      res.cookie("token", session._id, {
        httpOnly: true,
        signed: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        message: "Logged In",
      });
    }

    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    mongooseSession.startTransaction();
    await Directory.create(
      [
        {
          _id: rootDirId,
          name: `root-${email}`,
          userId,
          parentDirId: null,
        },
      ],
      { mongooseSession }
    );

    await User.create(
      [
        {
          _id: userId,
          name,
          picture,
          email,
          rootDirId,
        },
      ],
      { mongooseSession }
    );

    const session = await Session.create({ userId });

    res.cookie("token", session._id, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    mongooseSession.commitTransaction();
    return res.status(200).json({
      message: "Account Created & Logged In",
    });
  } catch (error) {
    mongooseSession.abortTransaction();
    next(error);
  }
};
