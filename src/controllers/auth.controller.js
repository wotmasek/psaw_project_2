function registerView(req, res) {
  return res.render("pages/auth/register", { pageTitle: "Rejestracja" });
}

function loginView(req, res) {
  return res.render("pages/auth/login", { pageTitle: "Logowanie" });
}

function authRequiredView(req, res) {
  return res.status(401).render("pages/auth/auth-required", {
    pageTitle: "Wymagane logowanie"
  });
}

function register(req, res) {
  // Celowy placeholder: logika rejestracji będzie dodana w etapie implementacji.
  return res.redirect("/login");
}

function login(req, res) {
  // Celowy placeholder sesji developerskiej.
  req.session.user = {
    id: 1,
    login: "demo-user",
    isAdmin: false
  };
  return res.redirect("/dashboard");
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = {
  registerView,
  loginView,
  authRequiredView,
  register,
  login,
  logout
};

