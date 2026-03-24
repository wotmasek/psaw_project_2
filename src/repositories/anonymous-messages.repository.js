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

module.exports = {
  create,
};
