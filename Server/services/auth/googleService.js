import { OAuth2Client } from "google-auth-library";

export const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage" // Redirect URI...
);

export async function verifyGoogleCode(code) {
  try {
    const { tokens } = await client.getToken(code); // tokens includes id_token, access_token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    throw new Error("Failed to verify Google code: " + error.message);
  }
}

