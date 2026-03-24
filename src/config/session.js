const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");
const env = require("./env");
const { pool } = require("./database");

const PgSession = connectPgSimple(session);

function createSessionMiddleware() {
  return session({
    name: env.sessionCookieName,
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true
    }),
    cookie: {
      httpOnly: true,
      secure: env.sessionCookieSecure,
      sameSite: env.sessionCookieSameSite,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  });
}

module.exports = {
  createSessionMiddleware
};

