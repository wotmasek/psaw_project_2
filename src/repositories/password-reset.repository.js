const { pool } = require("../config/database");

async function create({ userId, tokenHash, expiresAt }) {
  const { rows } = await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, created_at`,
    [userId, tokenHash, expiresAt]
  );
  return rows[0];
}

async function findValidByTokenHash(tokenHash) {
  const { rows } = await pool.query(
    `SELECT id, user_id, expires_at
     FROM password_reset_tokens
     WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
     ORDER BY created_at DESC
     LIMIT 1`,
    [tokenHash]
  );
  return rows[0] || null;
}

async function markUsed(id) {
  await pool.query(
    `UPDATE password_reset_tokens SET used_at = now() WHERE id = $1`,
    [id]
  );
}

async function invalidateForUser(userId) {
  await pool.query(
    `UPDATE password_reset_tokens SET used_at = now()
     WHERE user_id = $1 AND used_at IS NULL`,
    [userId]
  );
}

module.exports = {
  create,
  findValidByTokenHash,
  markUsed,
  invalidateForUser,
};
