function attachCurrentUser(req, res, next) {
  const sessionUser = req.session?.user || null;
  res.locals.currentUser = sessionUser;
  res.locals.isAuthenticated = Boolean(sessionUser);
  res.locals.isAdmin = Boolean(sessionUser?.isAdmin);
  res.locals.req = req;
  next();
}

module.exports = {
  attachCurrentUser,
};
