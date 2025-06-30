import mongoose, { Types } from "mongoose";
import redisClient from "../config/redis.js";
import Directory from "../models/dirModel.js";
import User from "../models/userModel.js";
import { verifyGoogleIdToken } from "../services/googleAuthService.js";
import CustomError from "../utils/ErrorResponse.js";
import { StatusCodes } from "http-status-codes";
import CustomSuccess from "../utils/SuccessResponse.js";

export const loginWithGoogle = async (req, res, next) => {
  const IdToken = req.body.credential;
  const mongooseSession = await mongoose.startSession();
  let transactionStarted = false;

  try {
    const userData = await verifyGoogleIdToken(IdToken);
    const { email, name, picture } = userData;
    const userFound = await User.findOne({ email });

    // If user is found and marked as deleted
    if (userFound?.isDeleted) {
      throw new CustomError(
        "User account is deactivated or deleted.",
        StatusCodes.FORBIDDEN
      );
    }

    if (userFound) {
      // Update picture if it's not from Google
      if (!userFound.picture.includes("googleusercontent.com")) {
        userFound.picture = picture;
        await userFound.save();
      }

      // Limit to 2 sessions
      const userSessions = await redisClient.ft.search(
        "userIdIdx",
        `@userId:{${userFound._id}}`,
        {
          RETURN: [],
        }
      );

      if (userSessions.total >= 2) {
        await redisClient.del(userSessions.documents[0].id);
      }

      const sessionID = crypto.randomUUID();
      const sessionExpiry = 7 * 24 * 60 * 60 * 1000;
      await redisClient.json.set(`session:${sessionID}`, "$", {
        userId: userFound._id,
        rootDirId: userFound.rootDirId,
      });
      await redisClient.expire(`session:${sessionID}`, sessionExpiry / 1000);
      res.cookie("token", sessionID, {
        httpOnly: true,
        signed: true,
        maxAge: sessionExpiry,
      });
      return CustomSuccess.send(res, "Logged in", StatusCodes.OK);
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

    const sessionID = crypto.randomUUID();
    const sessionExpiry = 7 * 24 * 60 * 60 * 1000;
    await redisClient.json.set(`session:${sessionID}`, "$", {
      userId: userId,
    });
    await redisClient.expire(`session:${sessionID}`, sessionExpiry / 1000);
    res.cookie("token", sessionID, {
      httpOnly: true,
      signed: true,
      maxAge: sessionExpiry,
    });

    await mongooseSession.commitTransaction();

    return CustomSuccess.send(
      res,
      "Account created & logged in",
      StatusCodes.OK
    );
  } catch (error) {
    if (transactionStarted) {
      await mongooseSession.abortTransaction();
    }
    next(error);
  } finally {
    mongooseSession.endSession();
  }
};
