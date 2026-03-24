/* eslint-disable no-console */
const { pool } = require("../../src/config/database");

async function run() {
  // Skeleton reset: keeps schema untouched.
  // In implementation phase, replace with truncation/reset sequence for MVP tables.
  console.log("[db:reset] placeholder only, no data was changed.");
}

run()
  .catch((error) => {
    console.error("[db:reset] failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

