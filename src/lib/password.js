const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

async function hash(plaintext) {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

async function verify(plaintext, hash) {
  return bcrypt.compare(plaintext, hash);
}

module.exports = { hash, verify };
