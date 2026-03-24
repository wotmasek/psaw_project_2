const app = require("./app");
const env = require("./config/env");
const { healthcheck } = require("./config/database");

async function start() {
  try {
    await healthcheck();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`[dlaczegozyc] listening on :${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[dlaczegozyc] startup error:", error.message);
    process.exit(1);
  }
}

start();

