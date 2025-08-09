// createEmailer.js:

"use strict";

const system = require("zyx-system");
const NodeEmailer = require("./nodeEmailer");

/**
 * Validates and instantiates a NodeEmailer.
 * @param {Object} tenant - Tenant config containing SMTP values.
 * @returns {NodeEmailer}
 * @throws {Error} - If validation or creation fails.
 */
async function createEmailer(tenant) {
  const emailer = new NodeEmailer(tenant);
  await emailer.createTransport;
  return emailer;
}

module.exports = createEmailer;
