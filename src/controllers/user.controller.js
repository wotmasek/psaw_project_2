const entryService = require("../services/entry.service");
const userSettingsService = require("../services/user-settings.service");
const usersRepo = require("../repositories/users.repository");
const { validateEntry } = require("../validators/entry.validator");
const {
  validateProfile,
  validateEmail,
  validateChangePassword,
} = require("../validators/auth.validator");
const authService = require("../services/auth.service");

async function dashboard(req, res) {
  const entries = await entryService.getUserEntries(req.session.user.id);
  return res.render("pages/user/dashboard", {
    pageTitle: "Panel użytkownika — dlaczegozyc.pl",
    activePage: "dashboard",
    entries: entries.slice(0, 3),
    totalEntries: entries.length,
  });
}

async function myEntries(req, res) {
  const entries = await entryService.getUserEntries(req.session.user.id);
  return res.render("pages/user/my-entries", {
    pageTitle: "Moje wpisy — dlaczegozyc.pl",
    activePage: "my-entries",
    entries,
  });
}

function createEntryView(req, res) {
  return res.render("pages/user/entry-create", {
    pageTitle: "Nowy wpis — dlaczegozyc.pl",
    activePage: "my-entries",
    formData: {},
    errors: [],
  });
}

async function createEntry(req, res) {
  const { title, body } = req.body;
  const errors = validateEntry({ title, body });

  if (errors.length) {
    return res.status(422).render("pages/user/entry-create", {
      pageTitle: "Nowy wpis — dlaczegozyc.pl",
      activePage: "my-entries",
      formData: { title, body },
      errors,
    });
  }

  await entryService.createEntry(req.session.user.id, { title, body });
  req.session.flash = { success: "Wpis został zapisany." };
  return res.redirect("/my-entries");
}

async function editEntryView(req, res) {
  const entry = await entryService.getEntryById(req.params.id);
  if (!entry || entry.user_id !== req.session.user.id) {
    return res.status(404).render("pages/shared/not-found", {
      pageTitle: "Nie znaleziono",
      activePage: "",
    });
  }
  return res.render("pages/user/entry-edit", {
    pageTitle: "Edycja wpisu — dlaczegozyc.pl",
    activePage: "my-entries",
    entry,
    errors: [],
  });
}

async function editEntry(req, res) {
  const entry = await entryService.getEntryById(req.params.id);
  if (!entry || entry.user_id !== req.session.user.id) {
    return res.status(404).render("pages/shared/not-found", {
      pageTitle: "Nie znaleziono",
      activePage: "",
    });
  }

  const { title, body } = req.body;
  const errors = validateEntry({ title, body });

  if (errors.length) {
    return res.status(422).render("pages/user/entry-edit", {
      pageTitle: "Edycja wpisu — dlaczegozyc.pl",
      activePage: "my-entries",
      entry: { ...entry, title, body },
      errors,
    });
  }

  await entryService.updateEntry(req.params.id, { title, body });
  req.session.flash = { success: "Wpis został zaktualizowany." };
  return res.redirect("/my-entries");
}

async function settingsView(req, res) {
  const user = await usersRepo.findById(req.session.user.id);
  const flash = req.session.flash || {};
  req.session.flash = null;
  return res.render("pages/user/settings", {
    pageTitle: "Ustawienia konta — dlaczegozyc.pl",
    activePage: "settings",
    user,
    errors: [],
    success: flash.success || null,
  });
}

async function updateProfile(req, res) {
  const { firstName, lastName } = req.body;
  const errors = validateProfile({ firstName, lastName });

  if (errors.length) {
    const user = await usersRepo.findById(req.session.user.id);
    return res.status(422).render("pages/user/settings", {
      pageTitle: "Ustawienia konta — dlaczegozyc.pl",
      activePage: "settings",
      user: { ...user, first_name: firstName, last_name: lastName },
      errors,
      success: null,
    });
  }

  const updated = await userSettingsService.updateProfile(req.session.user.id, { firstName, lastName });
  req.session.user.firstName = updated.first_name;
  req.session.user.lastName = updated.last_name;
  req.session.flash = { success: "Profil został zaktualizowany." };
  return res.redirect("/settings");
}

async function updateEmail(req, res) {
  const { email } = req.body;
  const errs = validateEmail({ email });

  if (errs.length) {
    const user = await usersRepo.findById(req.session.user.id);
    return res.status(422).render("pages/user/settings", {
      pageTitle: "Ustawienia konta — dlaczegozyc.pl",
      activePage: "settings",
      user: { ...user, email },
      errors: errs,
      success: null,
    });
  }

  const result = await userSettingsService.updateEmail(req.session.user.id, email);
  if (result.error) {
    const user = await usersRepo.findById(req.session.user.id);
    return res.status(422).render("pages/user/settings", {
      pageTitle: "Ustawienia konta — dlaczegozyc.pl",
      activePage: "settings",
      user: { ...user, email },
      errors: [result.error],
      success: null,
    });
  }

  req.session.user.email = result.user.email;
  req.session.flash = { success: "Adres e-mail został zmieniony." };
  return res.redirect("/settings");
}

async function changePassword(req, res) {
  const { currentPassword, newPassword, newPasswordConfirmation } = req.body;
  const errors = validateChangePassword({ currentPassword, newPassword, newPasswordConfirmation });

  if (errors.length) {
    const user = await usersRepo.findById(req.session.user.id);
    return res.status(422).render("pages/user/settings", {
      pageTitle: "Ustawienia konta — dlaczegozyc.pl",
      activePage: "settings",
      user,
      errors,
      success: null,
    });
  }

  const result = await userSettingsService.changePassword(req.session.user.id, {
    currentPassword,
    newPassword,
  });

  if (result.error) {
    const user = await usersRepo.findById(req.session.user.id);
    return res.status(422).render("pages/user/settings", {
      pageTitle: "Ustawienia konta — dlaczegozyc.pl",
      activePage: "settings",
      user,
      errors: [result.error],
      success: null,
    });
  }

  req.session.flash = { success: "Hasło zostało zmienione." };
  return res.redirect("/settings");
}

module.exports = {
  dashboard,
  myEntries,
  createEntryView,
  createEntry,
  editEntryView,
  editEntry,
  settingsView,
  updateProfile,
  updateEmail,
  changePassword,
};
