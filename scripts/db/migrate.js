const fs = require("fs/promises");
const path = require("path");
const { pool } = require("../../src/config/database");

async function run() {
  const dir = path.resolve(__dirname, "../../src/db/migrations");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = await fs.readFile(path.join(dir, file), "utf8");
    if (!sql.trim()) continue;
    await pool.query(sql);
    console.log(`[db:migrate] ${file} executed.`);
  }
}

run()
  .catch((error) => {
    console.error("[db:migrate] failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
