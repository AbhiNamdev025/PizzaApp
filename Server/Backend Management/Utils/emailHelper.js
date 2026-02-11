const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP - Pizzaiolo",
    html: `
      <div style="font-family: inherit; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ff6f61; text-align: center;">Pizzaiolo OTP Verification</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Use the following OTP to verify your account. This OTP is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff6f61; background: #fff8f0; padding: 10px 20px; border-radius: 5px; border: 1px dashed #ff6f61;">${otp}</span>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">© 2024 Pizzaiolo. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
