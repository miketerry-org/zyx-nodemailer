// createEmailer.js:

"use strict";

const { BaseEmailer } = require("zyx-base");
const system = require("zyx-system");
const Schema = require("zyx-schema");
const NodeEmailer = require("./nodeEmailer");

const { stringType, booleanType, integerType } = Schema.types;

/**
 * Validates and instantiates a NodeEmailer.
 * @param {Object} tenant - Tenant config containing SMTP values.
 * @returns {NodeEmailer}
 * @throws {Error} - If validation or creation fails.
 */
async function createEmailer(tenant) {
  const { validated, errors } = new Schema({
    smtp_host: stringType({ min: 1, max: 255, required: true }),
    smtp_port: integerType({ min: 1, max: 65535, required: true }),
    smtp_secure: booleanType({ required: true }),
    smtp_username: stringType({ min: 1, max: 255, required: true }),
    smtp_password: stringType({ min: 1, max: 255, required: true }),
  }).validate(tenant);

  if (errors.length > 0) {
    const message = errors.map(e => e.message).join(", ");
    system.log.error(`SMTP config validation failed: ${message}`);
    throw new Error(`SMTP config invalid: ${message}`);
  }

  try {
    const emailer = new NodeEmailer(validated);
    system.log.info(`NodeEmailer created for SMTP host ${validated.smtp_host}`);
    return emailer;
  } catch (err) {
    system.log.error(`NodeEmailer creation failed: ${err.message}`);
    throw new Error(`Failed to create NodeEmailer: ${err.message}`);
  }
}

module.exports = createEmailer;
