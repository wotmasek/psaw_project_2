const path = require("path");
const express = require("express");
const helmet = require("helmet");
const env = require("./config/env");
const { createSessionMiddleware } = require("./config/session");
const { attachCurrentUser } = require("./middleware/attach-current-user");
const { errorHandler, notFoundHandler } = require("./middleware/error-handler");
const publicRoutes = require("./routes/public.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.set("trust proxy", env.trustProxy);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: false, limit: env.bodyLimit }));
app.use(express.json({ limit: env.bodyLimit }));
app.use(express.static(path.join(__dirname, "public")));
app.use(createSessionMiddleware());
app.use(attachCurrentUser);

app.use(publicRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

