// nodeEmailer.js:

"use strict";

// load all necessary modules
const system = require("zyx-system");
const { BaseEmailer } = require("zyx-base");
const Schema = require("zyx-schema");
const nodemailer = require("nodemailer");

// destructure necessary schema types
const { stringType, booleanType, integerType } = Schema.types;

/**
 * Email sender class using SMTP via nodemailer.
 * @extends BaseEmailer
 */
class NodeEmailer extends BaseEmailer {
  /**
   * Validates SMTP configuration (`this.config`) against the schema.
   * Logs and throws an error if validation fails.
   * @throws {Error} If configuration is invalid.
   */
  verifyConfig() {
    const { validated, errors } = new Schema({
      smtp_host: stringType({ min: 1, max: 255, required: true }),
      smtp_port: integerType({ min: 1, max: 65535, required: true }),
      smtp_secure: booleanType({ required: true }),
      smtp_username: stringType({ min: 1, max: 255, required: true }),
      smtp_password: stringType({ min: 1, max: 255, required: true }),
    }).validate(this.config);

    if (errors.length > 0) {
      const message = errors.map(e => e.message).join(", ");
      system.log.error(`SMTP config validation failed: ${message}`);
      throw new Error(`SMTP config invalid: ${message}`);
    }
  }

  /**
   * Creates and verifies a nodemailer transport using SMTP config.
   * On success, sets `this.transport`; on failure, cleans up.
   * @async
   * @returns {Promise<void>}
   */
  async createTransport() {
    // destructure all smtp values from configuration object
    const { smtp_host, smtp_port, smtp_secure, smtp_username, smtp_password } =
      this.config;

    // create an instance of a nodemailer transport
    let transporter = nodemailer.createTransport({
      host: smtp_host,
      port: smtp_port,
      secure: smtp_secure,
      auth: {
        user: smtp_username,
        pass: smtp_password,
      },
      requireTLS: true,
      tls: {
        rejectUnauthorized: false,
      },
      logger: false,
      debug: false,
      name: "localhost",
    });

    try {
      // attempt to verify the smtp server connection
      await transporter.verify();

      // if success then assign transport
      this.transport = transporter;
    } catch (err) {
      // if unable to verify smtp connection then close nodemailer connection
      transporter.close();

      // set the transport to undefined
      this.transport = undefined;

      // throw error since email transporter is notvalid
      throw new Error("unable to connect to email server!");
    }
  }

  /**
   * Sends an email using the SMTP transport. Initializes transport on first use.
   * Relies on `buildMessageObject(data)` inherited from `BaseEmailer`.
   * @async
   * @param {Object} data - Data used to build the email (e.g., recipients, subject, content).
   * @returns {Promise<Object>} The result object from `transporter.sendMail`.
   */
  async send(data = {}) {
    console.log("Node:", data);

    if (!this.transport) {
      await this.createTransport();
    }

    console.log("before build");

    // build the email message object required by nodemailer
    const msg = await this.buildMessageObject(data);
    console.log("msg", msg);

    // send the email message
    const info = await this.transport.sendMail(msg);
    console.log("sent", info);

    // return data provided by nodemailer send method
    return info;
  }
}

module.exports = NodeEmailer;
