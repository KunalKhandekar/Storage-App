import { OAuth2Client } from "google-auth-library";
import CustomError from "../utils/ErrorResponse.js";
import { StatusCodes } from "http-status-codes";

const client = new OAuth2Client();

export async function verifyGoogleIdToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new CustomError(
      "Error while verifying ID_TOKEN",
      StatusCodes.INTERNAL_SERVER_ERROR,
      {
        details: error.message,
      }
    );
  }
}
