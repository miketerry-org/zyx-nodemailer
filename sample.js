// sample.js:

const { NodeEmailer } = require("./lib/nodeEmailer");

const config = {
  smtp_host: "mail.gandi.net",
  smtp_port: 587,
  smtp_secure: false,
  smtp_username: "support@miketerry.org",
  smtp_password: "ThdfGandi.2674",
};

async function mainLoop() {
  const emailer = new NodeEmailer(config);

  let info = await emailer
    .from("support@miketerry.org")
    .to("miketerry1030@gmail.com")
    .subject("test2")
    .textBody("message2")
    .send({});

  console.log("info", info);
}

mainLoop();
