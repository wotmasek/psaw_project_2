const crypto = require("crypto");

function hashPlaceholder(password) {
  // Placeholder helper for skeleton only.
  return crypto.createHash("sha256").update(password).digest("hex");
}

module.exports = {
  hashPlaceholder
};

