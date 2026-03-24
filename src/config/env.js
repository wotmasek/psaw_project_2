const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function toBool(value, fallback = false) {
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  trustProxy: toBool(process.env.TRUST_PROXY, false),
  bodyLimit: process.env.BODY_LIMIT || "100kb",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://dlaczegozyc_app:change-me-postgres-password@localhost:5432/dlaczegozyc",
  sessionSecret: process.env.SESSION_SECRET || "replace-with-long-random-secret",
  sessionCookieName: process.env.SESSION_COOKIE_NAME || "dlaczegozyc.sid",
  sessionCookieSecure: toBool(process.env.SESSION_COOKIE_SECURE, false),
  sessionCookieSameSite: process.env.SESSION_COOKIE_SAME_SITE || "lax",
  adminSeedLogin: process.env.ADMIN_SEED_LOGIN || "admin",
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD || "change-me-admin-password",
  smtp: {
    host: process.env.SMTP_HOST || "localhost",
    port: Number(process.env.SMTP_PORT || 1025),
    secure: toBool(process.env.SMTP_SECURE, false),
    user: process.env.SMTP_USER || "placeholder-user",
    password: process.env.SMTP_PASSWORD || "placeholder-password",
    fromName: process.env.SMTP_FROM_NAME || "dlaczegozyc.pl",
    fromEmail: process.env.SMTP_FROM_EMAIL || "noreply@example.local"
  }
};

module.exports = env;

