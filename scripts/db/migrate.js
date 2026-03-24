/* eslint-disable no-console */
const fs = require("fs/promises");
const path = require("path");
const { pool } = require("../../src/config/database");

async function run() {
  const migrationPath = path.resolve(__dirname, "../../src/db/migrations/0001_init_schema.sql");
  const sql = await fs.readFile(migrationPath, "utf8");
  if (!sql.trim()) {
    console.log("[db:migrate] migration file is empty.");
    return;
  }
  await pool.query(sql);
  console.log("[db:migrate] migration executed.");
}

run()
  .catch((error) => {
    console.error("[db:migrate] failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

