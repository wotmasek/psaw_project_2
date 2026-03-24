const { pool } = require("../config/database");

async function findPublished() {
  const { rows } = await pool.query(
    `SELECT id, emoji, title, content, source, created_at
     FROM inspirations
     WHERE status = 'published'
     ORDER BY created_at DESC`
  );
  return rows;
}

async function findAll() {
  const { rows } = await pool.query(
    `SELECT id, emoji, title, content, source, status, created_at, updated_at
     FROM inspirations
     ORDER BY created_at DESC`
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, emoji, title, content, source, status, created_by_user_id, created_at, updated_at
     FROM inspirations
     WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function findRandom() {
  const { rows } = await pool.query(
    `SELECT id, emoji, title, content, source, created_at
     FROM inspirations
     WHERE status = 'published'
     ORDER BY random()
     LIMIT 1`
  );
  return rows[0] || null;
}

async function create({ emoji, title, content, source, status }) {
  const { rows } = await pool.query(
    `INSERT INTO inspirations (emoji, title, content, source, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, emoji, title, content, source, status, created_at`,
    [emoji || "", title || "", content, source || "manual", status || "published"]
  );
  return rows[0];
}

async function update(id, { emoji, title, content, status }) {
  const { rows } = await pool.query(
    `UPDATE inspirations
     SET emoji = $2, title = $3, content = $4, status = $5, updated_at = now()
     WHERE id = $1
     RETURNING id, emoji, title, content, source, status, updated_at`,
    [id, emoji || "", title || "", content || "", status || "draft"]
  );
  return rows[0] || null;
}

async function updateStatus(id, status) {
  await pool.query(
    `UPDATE inspirations SET status = $2, updated_at = now() WHERE id = $1`,
    [id, status]
  );
}

async function remove(id) {
  await pool.query(`DELETE FROM inspirations WHERE id = $1`, [id]);
}

async function countByStatus() {
  const { rows } = await pool.query(
    `SELECT status, COUNT(*)::int AS count FROM inspirations GROUP BY status`
  );
  const result = { draft: 0, published: 0, archived: 0 };
  rows.forEach((r) => { result[r.status] = r.count; });
  return result;
}

module.exports = {
  findPublished,
  findAll,
  findById,
  findRandom,
  create,
  update,
  updateStatus,
  remove,
  countByStatus,
};
