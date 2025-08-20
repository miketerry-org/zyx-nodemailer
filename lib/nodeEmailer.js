// nodeEmailer.js:

"use strict";

/**
 * NodeEmailer - SMTP email service using nodemailer.
 * Extends BaseEmailer, which itself extends BaseService.
 */

const { BaseEmailer } = require("zyx-base");
const Schema = require("zyx-schema");
const system = require("zyx-system");
const nodemailer = require("nodemailer");

const { stringType, booleanType, integerType } = Schema.types;

/**
 * Email sender class using SMTP via nodemailer.
 * Inherits connection lifecycle and message templating from BaseEmailer.
 *
 * @extends BaseEmailer
 */
class NodeEmailer extends BaseEmailer {
  /**
   * Validates SMTP configuration using a strict schema.
   * Automatically called from Base constructor.
   *
   * @override
   * @throws {Error} If configuration is invalid.
   */
  verifyConfig() {
    const { errors } = new Schema({
      smtp_host: stringType({ min: 1, max: 255, required: true }),
      smtp_port: integerType({ min: 1, max: 65535, required: true }),
      smtp_secure: booleanType({ required: true }),
      smtp_username: stringType({ min: 1, max: 255, required: true }),
      smtp_password: stringType({ min: 1, max: 255, required: true }),
    }).validate(this.config);

    if (errors.length > 0) {
      const message = errors.map(e => e.message).join(", ");
      system.log?.error?.(`SMTP config validation failed: ${message}`);
      throw new Error("SMTP config invalid: " + message);
    }
  }

  /**
   * Establishes SMTP transport via nodemailer.
   * Required by BaseService.
   *
   * @override
   * @returns {Promise<void>}
   */
  async connect() {
    await this.createTransport();
  }

  /**
   * Closes the current SMTP transport, if available.
   * Required by BaseService.
   *
   * @override
   * @returns {Promise<void>}
   */
  async disconnect() {
    const conn = this.connection;
    if (conn?.close) {
      const maybePromise = conn.close();
      if (maybePromise instanceof Promise) await maybePromise;
    }
    this.setConnection(undefined);
  }

  /**
   * Creates and verifies a nodemailer transport.
   *
   * @override
   * @returns {Promise<void>}
   * @throws {Error} If connection fails.
   */
  async createTransport() {
    const { smtp_host, smtp_port, smtp_secure, smtp_username, smtp_password } =
      this.config;

    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: smtp_port,
      secure: smtp_secure,
      auth: {
        user: smtp_username,
        pass: smtp_password,
      },
      requireTLS: true,
      tls: {
        rejectUnauthorized: false, // ⚠️ Consider making this configurable for stricter environments
      },
      logger: false,
      debug: false,
      name: "localhost",
    });

    try {
      await transporter.verify();
      this.transport = transporter;
      this.setConnection(transporter);
    } catch (err) {
      transporter.close?.();
      this.setConnection(undefined);
      system.log?.error?.("SMTP connection failed: " + err.message);
      throw new Error("Unable to connect to SMTP server: " + err.message);
    }
  }

  /**
   * Sends an email using the SMTP transport.
   *
   * @override
   * @param {object} [data={}] - Data for templating email content.
   * @returns {Promise<object>} Result from nodemailer `sendMail`.
   */
  async send(data = {}) {
    if (!this.connection) {
      await this.connect();
    }

    const msg = await this.buildMessageObject(data);
    return this.connection.sendMail(msg);
  }
}

module.exports = NodeEmailer;
