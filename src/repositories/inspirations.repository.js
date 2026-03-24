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

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, emoji, title, content, source, status, created_at
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

async function create({ emoji, title, content, source }) {
  const { rows } = await pool.query(
    `INSERT INTO inspirations (emoji, title, content, source, status)
     VALUES ($1, $2, $3, $4, 'published')
     RETURNING id, emoji, title, content, source, created_at`,
    [emoji || "", title || "", content, source || "generator"]
  );
  return rows[0];
}

module.exports = {
  findPublished,
  findById,
  findRandom,
  create,
};
