const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

let resendClient = null;
if (RESEND_API_KEY) {
  resendClient = new Resend(RESEND_API_KEY);
}

const sendPasswordResetOtpEmail = async ({ toEmail, otp }) => {
  if (!resendClient) {
    throw new Error("Resend is not configured. Please set RESEND_API_KEY.");
  }

  await resendClient.emails.send({
    from: RESEND_FROM_EMAIL,
    to: toEmail,
    subject: "Your password reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password reset request</h2>
        <p>Use the OTP below to reset your password:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
  sendPasswordResetOtpEmail,
};