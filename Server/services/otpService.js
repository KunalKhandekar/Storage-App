import { Resend } from "resend";

const resend = new Resend("re_e7bSjkA8_61C5xGQE1jqsg77VfQLpe6Dj");

export const sendOTPService = async (email, otp) => {
  const res = await resend.emails.send({
    from: "Storage App <otp@resend.dev>",
    to: [email],
    subject: "Your OTP for Authentication",
    text: `Your OTP is ${otp}`,
  });

  return res;
};
