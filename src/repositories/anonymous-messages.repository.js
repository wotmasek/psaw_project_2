const { pool } = require("../config/database");

async function create({ body }) {
  const { rows } = await pool.query(
    `INSERT INTO anonymous_messages (body)
     VALUES ($1)
     RETURNING id, created_at`,
    [body]
  );
  return rows[0];
}

async function findAll() {
  const { rows } = await pool.query(
    `SELECT id, body, status, created_at, updated_at
     FROM anonymous_messages
     ORDER BY created_at DESC`
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, body, status, created_at, updated_at
     FROM anonymous_messages WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function updateStatus(id, status) {
  await pool.query(
    `UPDATE anonymous_messages SET status = $2, updated_at = now() WHERE id = $1`,
    [id, status]
  );
}

async function remove(id) {
  await pool.query(`DELETE FROM anonymous_messages WHERE id = $1`, [id]);
}

async function countByStatus() {
  const { rows } = await pool.query(
    `SELECT status, COUNT(*)::int AS count FROM anonymous_messages GROUP BY status`
  );
  const result = { new: 0, reviewed: 0, archived: 0 };
  rows.forEach((r) => { result[r.status] = r.count; });
  return result;
}

module.exports = { create, findAll, findById, updateStatus, remove, countByStatus };
