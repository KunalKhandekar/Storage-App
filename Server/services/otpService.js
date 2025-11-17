import { Resend } from "resend";
import CustomError from "../utils/ErrorResponse.js";
import { StatusCodes } from "http-status-codes";

const resend = new Resend(process.env.RESEND_KEY);

const otpTemplate = (otp) => {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OTP Verification</title>

  <style>
    @media only screen and (max-width: 480px) {
      .wrapper {
        width: 100% !important;
        padding: 18px !important;
      }
      .otp-box {
        font-size: 26px !important;
        letter-spacing: 12px !important;
      }
    }
  </style>
</head>

<body style="margin:0; padding:0; background:#e8eef7; font-family:Arial, Helvetica, sans-serif;">

  <center style="width:100%; padding:32px 0;">

    <table role="presentation" class="wrapper"
      style="width:450px; max-width:450px; background:#ffffff; border-radius:14px;
             padding:28px; box-shadow:0 4px 18px rgba(0, 80, 170, 0.15);">

      <!-- Header -->
      <tr>
        <td style="padding:16px 0; text-align:center;
                   background:linear-gradient(135deg, #0a2e73, #2563eb);
                   border-radius:12px; color:#ffffff; font-size:18px; font-weight:600;">
          OTP Verification
        </td>
      </tr>

      <!-- OTP -->
      <tr>
        <td style="padding-top:30px; text-align:center;">
          <div class="otp-box" style="
            display:inline-block;
            padding:22px 34px;
            background:#f0f6ff;
            border-radius:12px;
            border:1px solid #c8d8f3;
            font-size:32px;
            font-weight:700;
            color:#0a2e73;
            font-family:'Courier New', Courier, monospace;
          ">
           ${otp}
          </div>
        </td>
      </tr>

      <!-- Expiry -->
      <tr>
        <td style="padding-top:22px; text-align:center; font-size:15px; color:#3b4a66;">
          This code is valid for <strong>10 minutes</strong>.
        </td>
      </tr>

      <!-- Spacing -->
      <tr><td style="padding-bottom:12px;"></td></tr>

    </table>

  </center>

</body>
</html>
`;
};

export const sendOTPService = async (email, otp) => {
  try {
    const res = await resend.emails.send({
      from: "StoreMyStuff <no-reply@storemystuff.cloud>",
      to: [email],
      subject: "Your OTP for Authentication",
      html: otpTemplate(otp),
    });

    return res;
  } catch (error) {
    throw new CustomError(
      "Error while sending email",
      StatusCodes.INTERNAL_SERVER_ERROR,
      {
        details: error.message,
      }
    );
  }
};
