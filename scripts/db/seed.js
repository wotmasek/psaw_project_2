/* eslint-disable no-console */
const fs = require("fs/promises");
const path = require("path");
const { pool } = require("../../src/config/database");

async function run() {
  const seedPath = path.resolve(__dirname, "../../src/db/seeds/0001_seed_dev.sql");
  const sql = await fs.readFile(seedPath, "utf8");
  if (!sql.trim()) {
    console.log("[db:seed] seed file is empty.");
    return;
  }
  await pool.query(sql);
  console.log("[db:seed] seed executed.");
}

run()
  .catch((error) => {
    console.error("[db:seed] failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

