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

  let transactionStarted = false;

  try {
    const userFound = await User.findOne({ email });

    // If user is found and marked as deleted
    if (userFound?.isDeleted) {
      return res
        .status(403)
        .json({ message: "User account is deactivated or deleted." });
    }

    if (userFound) {
      // Update picture if it's not from Google
      if (!userFound.picture.includes("googleusercontent.com")) {
        userFound.picture = picture;
        await userFound.save();
      }

      // Limit to 2 sessions
      const userSessions = await Session.find({ userId: userFound._id });

      if (userSessions.length >= 2) {
        let oldestSession = userSessions[0];
        userSessions.forEach((session) => {
          if (session.createdAt < oldestSession.createdAt) {
            oldestSession = session;
          }
        });
        await Session.deleteOne({ _id: oldestSession._id });
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

    // Create new user and root directory
    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    mongooseSession.startTransaction();
    transactionStarted = true;

    await Directory.create(
      [
        {
          _id: rootDirId,
          name: `root-${email}`,
          userId,
          parentDirId: null,
        },
      ],
      { session: mongooseSession }
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
      { session: mongooseSession }
    );

    const session = await Session.create({ userId });

    res.cookie("token", session._id, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await mongooseSession.commitTransaction();

    return res.status(200).json({
      message: "Account Created & Logged In",
    });
  } catch (error) {
    if (transactionStarted) {
      await mongooseSession.abortTransaction();
    }
    next(error);
  } finally {
    mongooseSession.endSession();
  }
};
