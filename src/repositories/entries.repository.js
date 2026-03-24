const { pool } = require("../config/database");

async function findByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT id, title, body, status, created_at, updated_at
     FROM entries
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

async function findAll() {
  const { rows } = await pool.query(
    `SELECT e.id, e.user_id, e.title, e.body, e.status, e.created_at, e.updated_at,
            u.login AS author_login
     FROM entries e
     LEFT JOIN users u ON u.id = e.user_id
     ORDER BY e.created_at DESC`
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, user_id, title, body, status, created_at, updated_at
     FROM entries WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function create({ userId, title, body }) {
  const { rows } = await pool.query(
    `INSERT INTO entries (user_id, title, body)
     VALUES ($1, $2, $3)
     RETURNING id, title, body, status, created_at`,
    [userId, title || "", body || ""]
  );
  return rows[0];
}

async function update(id, { title, body }) {
  const { rows } = await pool.query(
    `UPDATE entries SET title = $2, body = $3, updated_at = now()
     WHERE id = $1
     RETURNING id, title, body, status, updated_at`,
    [id, title || "", body || ""]
  );
  return rows[0] || null;
}

async function updateStatus(id, status) {
  await pool.query(
    `UPDATE entries SET status = $2, updated_at = now() WHERE id = $1`,
    [id, status]
  );
}

async function remove(id) {
  await pool.query(`DELETE FROM entries WHERE id = $1`, [id]);
}

async function countByStatus() {
  const { rows } = await pool.query(
    `SELECT status, COUNT(*)::int AS count FROM entries GROUP BY status`
  );
  const result = { active: 0, saved: 0, archived: 0 };
  rows.forEach((r) => { result[r.status] = r.count; });
  return result;
}

module.exports = {
  findByUserId,
  findAll,
  findById,
  create,
  update,
  updateStatus,
  remove,
  countByStatus,
};
