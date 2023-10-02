const crypto = require("crypto"); // importing the crypto module

const JWT_SECRET = crypto.randomBytes(32).toString("hex");

module.exports = { JWT_SECRET };
