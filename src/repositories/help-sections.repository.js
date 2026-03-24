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

module.exports = {
  findPublished,
};
