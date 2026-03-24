function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.redirect("/auth-required");
  }
  return next();
}

module.exports = {
  requireAuth
};

