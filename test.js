// test.js

const { createEmailer } = require("./index");

const config = {
  smtp_host: "mail.gandi.net",
  smtp_port: 587,
  smtp_secure: false,
  smtp_username: "support@miketerry.org",
  smtp_password: "ThdfGandi.2674",
};

async function mainLoop() {
  try {
    const emailer = await createEmailer(config);

    await emailer
      .from("support@miketerry.org")
      .to("miketerry1030@gmail.com")
      .subject("test1")
      .textBody("this is a message #2")
      .send();

    console.log("message sent");
  } catch (err) {
    console.log("err", err);
  }
}

mainLoop();
