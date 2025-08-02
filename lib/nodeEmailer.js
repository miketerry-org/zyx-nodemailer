// nodeEmailer.js:

"use strict";

// load all necessary modules
const { BaseEmailer } = require("zyx-base");
const nodemailer = require("nodemailer");

/**
 * Node.js implementation of BaseEmailer using Nodemailer.
 */
class NodeEmailer extends BaseEmailer {
  #host;
  #port;
  #secure;
  #username;
  #password;

  /**
   * @param {object} config
   * @param {string} config.smtp_host
   * @param {number} config.smtp_port
   * @param {boolean} config.smtp_secure
   * @param {string} config.smtp_username
   * @param {string} config.smtp_password
   */
  constructor(config) {
    super();
    this.#host = config.smtp_host;
    this.#port = config.smtp_port;
    this.#secure = config.smtp_secure;
    this.#username = config.smtp_username;
    this.#password = config.smtp_password;
  }

  /**
   * @returns {object} Nodemailer transporter instance
   */
  _getTransporter() {
    return nodemailer.createTransport({
      host: this.#host,
      port: this.#port,
      secure: this.#secure,
      auth: {
        user: this.#username,
        pass: this.#password,
      },
    });
  }

  /**
   * Sends the email via Nodemailer using rendered templates and content.
   * @param {object} [data={}] - Data context for Handlebars rendering
   * @returns {Promise<void>}
   */
  async send(data = {}) {
    const transporter = this._getTransporter();
    const message = await this.buildMessageObject(data);

    try {
      const info = await transporter.sendMail(message);
      console.log(`Email sent: ${info.messageId}`);
    } catch (err) {
      console.error("Failed to send email:", err);
      throw err;
    }
  }
}

module.exports = {
  NodeEmailer,
};
