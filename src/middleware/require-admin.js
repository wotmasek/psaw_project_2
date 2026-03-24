function requireAdmin(req, res, next) {
  if (!req.session?.user) {
    return res.redirect("/auth-required");
  }
  if (!req.session.user.isAdmin) {
    return res.status(403).render("pages/shared/forbidden", {
      pageTitle: "Brak dostępu"
    });
  }
  return next();
}

module.exports = {
  requireAdmin
};

