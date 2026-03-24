const { pool } = require("../config/database");

async function findPublished() {
  const { rows } = await pool.query(
    `SELECT id, category, title, body, display_order
     FROM help_sections
     WHERE status = 'published'
     ORDER BY display_order ASC`
  );
  return rows;
}

async function findAll() {
  const { rows } = await pool.query(
    `SELECT id, category, title, body, display_order, status, created_at, updated_at
     FROM help_sections
     ORDER BY display_order ASC, created_at DESC`
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, category, title, body, display_order, status, created_at, updated_at
     FROM help_sections WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function create({ category, title, body, displayOrder, status }) {
  const { rows } = await pool.query(
    `INSERT INTO help_sections (category, title, body, display_order, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, category, title, body, display_order, status, created_at`,
    [category || "", title || "", body || "", displayOrder || 0, status || "draft"]
  );
  return rows[0];
}

async function update(id, { category, title, body, displayOrder, status }) {
  const { rows } = await pool.query(
    `UPDATE help_sections
     SET category = $2, title = $3, body = $4, display_order = $5, status = $6, updated_at = now()
     WHERE id = $1
     RETURNING id, category, title, body, display_order, status, updated_at`,
    [id, category || "", title || "", body || "", displayOrder || 0, status || "draft"]
  );
  return rows[0] || null;
}

async function remove(id) {
  await pool.query(`DELETE FROM help_sections WHERE id = $1`, [id]);
}

module.exports = { findPublished, findAll, findById, create, update, remove };
