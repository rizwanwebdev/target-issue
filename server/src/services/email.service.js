import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
  // Connection/timeouts in milliseconds
  connectionTimeout: 30_000, // 30 seconds
  greetingTimeout: 30_000, // 30 seconds
  socketTimeout: 60_000, // 60 seconds
});

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("SMTP connection failed:", error);
//   } else {
//     console.log("SMTP server is ready");
//   }
// });

export default async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"TargetIssue" <${config.GOOGLE_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email sending failed:", error);

    return {
      error: true,
      message: error.message,
    };
  }
}
