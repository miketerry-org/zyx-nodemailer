// test-gandi-smtp.js
const nodemailer = require("nodemailer");

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: "mail.gandi.net", // Gandi SMTP host
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: "support@miketerry.org",
      pass: "Thdfgandi.2674",
    },
    requireTLS: true, // enforce upgrade to TLS
    tls: {
      rejectUnauthorized: false, // in case the server uses a self-signed cert
    },
    logger: true,
    debug: true,
  });

  try {
    await transporter.verify();
    console.log("✅ Connection verified: your credentials are correct.");
  } catch (err) {
    console.error("❌ SMTP verification error:", err);
  } finally {
    transporter.close();
  }
}

testSMTP();
