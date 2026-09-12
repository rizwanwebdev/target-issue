import nodemailer from "nodemailer";

let transporter = null;

async function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 2525,
    secure: false,

    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },

    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  return transporter;
}

export default async function sendEmail(to, subject, text, html) {
  try {
    const mailer = await getTransporter();

    const info = await mailer.sendMail({
      from: '"TargetIssue" <noreply@targetissue.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    if (info.rejected.length > 0) {
      console.warn("Some recipients were rejected:", info.rejected);
    }

    return info;
  } catch (err) {
    switch (err.code) {
      case "ECONNECTION":
      case "ETIMEDOUT":
        console.error("Network error:", err.message);
        break;

      case "EAUTH":
        console.error("Authentication failed:", err.message);
        break;

      case "EENVELOPE":
        console.error("Invalid envelope:", err.message, err.rejected || []);
        break;

      default:
        console.error("Send failed:", err.message);
    }

    throw err;
  }
}
