import { OAuth2Client } from "google-auth-library";


export const clientID = '53857639641-1se37lrtof61kmpu74g521k95erfpmkc.apps.googleusercontent.com';

const client = new OAuth2Client();

export async function verifyGoogleIdToken(idToken, client_id) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: client_id,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.log(error.message);
    return { error: error.message };
  }
}