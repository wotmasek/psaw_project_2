const { pool } = require("../config/database");

async function findByLogin(login) {
  const { rows } = await pool.query(
    `SELECT id, login, email, first_name, last_name, password_hash, is_admin, created_at
     FROM users WHERE login = $1`,
    [login]
  );
  return rows[0] || null;
}

async function findByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, login, email, first_name, last_name, password_hash, is_admin, created_at
     FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, login, email, first_name, last_name, password_hash, is_admin, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function create({ login, passwordHash, email }) {
  const { rows } = await pool.query(
    `INSERT INTO users (login, password_hash, email)
     VALUES ($1, $2, $3)
     RETURNING id, login, email, is_admin, created_at`,
    [login, passwordHash, email || null]
  );
  return rows[0];
}

async function updateProfile(id, { firstName, lastName }) {
  const { rows } = await pool.query(
    `UPDATE users SET first_name = $2, last_name = $3, updated_at = now()
     WHERE id = $1
     RETURNING id, login, email, first_name, last_name, is_admin`,
    [id, firstName || "", lastName || ""]
  );
  return rows[0] || null;
}

async function updateEmail(id, email) {
  const { rows } = await pool.query(
    `UPDATE users SET email = $1, updated_at = now()
     WHERE id = $2
     RETURNING id, login, email, first_name, last_name, is_admin`,
    [email || null, id]
  );
  return rows[0] || null;
}

async function updatePasswordHash(id, passwordHash) {
  await pool.query(
    `UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1`,
    [id, passwordHash]
  );
}

async function loginExists(login) {
  const { rows } = await pool.query(
    `SELECT 1 FROM users WHERE login = $1`,
    [login]
  );
  return rows.length > 0;
}

async function emailExists(email, excludeUserId) {
  let query = `SELECT 1 FROM users WHERE email = $1`;
  const params = [email];
  if (excludeUserId) {
    query += ` AND id != $2`;
    params.push(excludeUserId);
  }
  const { rows } = await pool.query(query, params);
  return rows.length > 0;
}

module.exports = {
  findByLogin,
  findByEmail,
  findById,
  create,
  updateProfile,
  updateEmail,
  updatePasswordHash,
  loginExists,
  emailExists,
};
