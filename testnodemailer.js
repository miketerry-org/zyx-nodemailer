// test-nodemailer.js
/**
 * A simple script to test sending an email using Nodemailer with Gandi SMTP.
 * Make sure the 'from' address matches the authenticated SMTP account's domain.
 */

const nodemailer = require("nodemailer");

// === Configuration ===
const SMTP_HOST = "mail.gandi.net";
const SMTP_PORT = 587;
const SMTP_SECURE = false; // STARTTLS
const SMTP_USER = "support@miketerry.org";
const SMTP_PASS = "ThdfGandi.2674";

// === Email Data ===
const mailOptions = {
  from: `"Test Sender" <${SMTP_USER}>`, // Must match your SMTP user domain
  to: "miketerry1030@gmail.com",
  subject: "Test Email via Nodemailer",
  text: "This is a test email sent using Nodemailer configured directly.",
  // html: "<p>This is a test email sent using Nodemailer configured directly.</p>",
};

async function sendTestEmail() {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    requireTLS: true,
    tls: {
      rejectUnauthorized: false,
    },
    // logger: true,
    // debug: true,
    name: "localhost", // optional: set EHLO name to avoid common HELO-related issues :contentReference[oaicite:0]{index=0}
  });

  try {
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("Connection verified ✅");

    console.log("Sending test email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("Failed to send email:", err);
  } finally {
    transporter.close();
  }
}

sendTestEmail();
