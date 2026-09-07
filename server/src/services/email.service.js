import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed:", err);
}

/**
 * Sends an email using the configured SMTP transporter.
 *
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text email content.
 * @param {string} html - HTML email content.
 * @returns {Promise<object>} Nodemailer response information.
 */
export default async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: '"TargetIssue" <noreply@targetissue.com>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    if (info.rejected.length > 0) {
      console.warn("Some recipients were rejected:", info.rejected);
    }
  } catch (err) {
    switch (err.code) {
      case "ECONNECTION":
      case "ETIMEDOUT":
        console.error("Network error - retry later:", err.message);
        break;
      case "EAUTH":
        console.error("Authentication failed:", err.message);
        break;
      case "EENVELOPE":
        // err.rejected is only present when every recipient was refused
        console.error("Invalid envelope:", err.message, err.rejected || []);
        break;
      default:
        console.error("Send failed:", err.message);
    }
  }
}
