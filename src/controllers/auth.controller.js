const authService = require("../services/auth.service");
const usersRepo = require("../repositories/users.repository");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../validators/auth.validator");
const crypto = require("crypto");
const resetRepo = require("../repositories/password-reset.repository");

function registerView(req, res) {
  if (req.session?.user) return res.redirect("/dashboard");
  return res.render("pages/auth/register", {
    pageTitle: "Rejestracja — dlaczegozyc.pl",
    activePage: "register",
    formData: {},
    errors: [],
  });
}

async function register(req, res) {
  if (req.session?.user) return res.redirect("/dashboard");

  const { login, password, passwordConfirmation } = req.body;
  const errors = validateRegister({ login, password, passwordConfirmation });

  if (errors.length) {
    return res.status(422).render("pages/auth/register", {
      pageTitle: "Rejestracja — dlaczegozyc.pl",
      activePage: "register",
      formData: { login },
      errors,
    });
  }

  const result = await authService.register({ login, plainPassword: password });

  if (result.error) {
    return res.status(422).render("pages/auth/register", {
      pageTitle: "Rejestracja — dlaczegozyc.pl",
      activePage: "register",
      formData: { login },
      errors: [result.error],
    });
  }

  req.session.flash = { success: "Konto zostało utworzone. Możesz się zalogować." };
  return res.redirect("/login");
}

function loginView(req, res) {
  if (req.session?.user) return res.redirect("/dashboard");
  const flash = req.session.flash || {};
  req.session.flash = null;
  return res.render("pages/auth/login", {
    pageTitle: "Logowanie — dlaczegozyc.pl",
    activePage: "login",
    formData: {},
    errors: [],
    success: flash.success || null,
  });
}

async function login(req, res) {
  if (req.session?.user) return res.redirect("/dashboard");

  const { login, password } = req.body;
  const errors = validateLogin({ login, password });

  if (errors.length) {
    return res.status(422).render("pages/auth/login", {
      pageTitle: "Logowanie — dlaczegozyc.pl",
      activePage: "login",
      formData: { login },
      errors,
      success: null,
    });
  }

  const result = await authService.authenticate({ login, plainPassword: password });

  if (result.error) {
    return res.status(422).render("pages/auth/login", {
      pageTitle: "Logowanie — dlaczegozyc.pl",
      activePage: "login",
      formData: { login },
      errors: [result.error],
      success: null,
    });
  }

  req.session.regenerate((err) => {
    if (err) throw err;
    req.session.user = authService.buildSessionUser(result.user);
    req.session.save(() => {
      return res.redirect("/dashboard");
    });
  });
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("dlaczegozyc.sid");
    res.redirect("/");
  });
}

function authRequiredView(req, res) {
  if (req.session?.user) return res.redirect("/dashboard");
  return res.status(401).render("pages/auth/auth-required", {
    pageTitle: "Wymagane logowanie — dlaczegozyc.pl",
    activePage: "",
  });
}

function forgotPasswordView(req, res) {
  if (req.session?.user) return res.redirect("/dashboard");
  return res.render("pages/auth/forgot-password", {
    pageTitle: "Odzyskaj hasło — dlaczegozyc.pl",
    activePage: "",
    formData: {},
    errors: [],
    sent: false,
  });
}

async function forgotPassword(req, res) {
  if (req.session?.user) return res.redirect("/dashboard");

  const { email } = req.body;
  const errors = validateForgotPassword({ email });

  if (errors.length) {
    return res.status(422).render("pages/auth/forgot-password", {
      pageTitle: "Odzyskaj hasło — dlaczegozyc.pl",
      activePage: "",
      formData: { email },
      errors,
      sent: false,
    });
  }

  await authService.requestPasswordReset(email);

  return res.render("pages/auth/forgot-password", {
    pageTitle: "Odzyskaj hasło — dlaczegozyc.pl",
    activePage: "",
    formData: {},
    errors: [],
    sent: true,
  });
}

async function resetPasswordView(req, res) {
  const { token } = req.params;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const record = await resetRepo.findValidByTokenHash(tokenHash);

  if (!record) {
    return res.status(410).render("pages/auth/reset-password-invalid", {
      pageTitle: "Link wygasł — dlaczegozyc.pl",
      activePage: "",
    });
  }

  return res.render("pages/auth/reset-password", {
    pageTitle: "Nowe hasło — dlaczegozyc.pl",
    activePage: "",
    token,
    errors: [],
  });
}

async function resetPassword(req, res) {
  const { token } = req.params;
  const { password, passwordConfirmation } = req.body;

  const errors = validateResetPassword({ password, passwordConfirmation });
  if (errors.length) {
    return res.status(422).render("pages/auth/reset-password", {
      pageTitle: "Nowe hasło — dlaczegozyc.pl",
      activePage: "",
      token,
      errors,
    });
  }

  const result = await authService.resetPassword(token, password);

  if (result.error) {
    return res.status(410).render("pages/auth/reset-password-invalid", {
      pageTitle: "Link wygasł — dlaczegozyc.pl",
      activePage: "",
    });
  }

  req.session.flash = { success: "Hasło zostało zmienione. Możesz się zalogować." };
  return res.redirect("/login");
}

module.exports = {
  registerView,
  register,
  loginView,
  login,
  logout,
  authRequiredView,
  forgotPasswordView,
  forgotPassword,
  resetPasswordView,
  resetPassword,
};
