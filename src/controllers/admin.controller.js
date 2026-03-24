const inspirationsRepo = require("../repositories/inspirations.repository");
const helpRepo = require("../repositories/help-sections.repository");
const messagesRepo = require("../repositories/anonymous-messages.repository");
const entriesRepo = require("../repositories/entries.repository");
const { validateInspiration, validateHelpSection, isValidStatus, VALID_STATUSES } = require("../validators/admin.validator");

async function dashboard(req, res) {
  const [inspCounts, msgCounts, entryCounts] = await Promise.all([
    inspirationsRepo.countByStatus(),
    messagesRepo.countByStatus(),
    entriesRepo.countByStatus(),
  ]);
  return res.render("pages/admin/dashboard", {
    pageTitle: "Panel admina — dlaczegozyc.pl",
    activePage: "admin-dashboard",
    inspCounts,
    msgCounts,
    entryCounts,
  });
}

// --- Inspirations CRUD ---

async function inspirationsList(req, res) {
  const inspirations = await inspirationsRepo.findAll();
  const flash = req.session.flash || {};
  req.session.flash = null;
  return res.render("pages/admin/inspirations-list", {
    pageTitle: "Inspiracje — Admin",
    activePage: "admin-inspirations",
    inspirations,
    success: flash.success || null,
  });
}

function inspirationCreateView(req, res) {
  return res.render("pages/admin/inspiration-form", {
    pageTitle: "Nowa inspiracja — Admin",
    activePage: "admin-inspirations",
    inspiration: null,
    formData: {},
    errors: [],
  });
}

async function inspirationCreate(req, res) {
  const { emoji, title, content, status } = req.body;
  const errors = validateInspiration({ emoji, title, content, status });
  if (errors.length) {
    return res.status(422).render("pages/admin/inspiration-form", {
      pageTitle: "Nowa inspiracja — Admin",
      activePage: "admin-inspirations",
      inspiration: null,
      formData: { emoji, title, content, status },
      errors,
    });
  }
  await inspirationsRepo.create({ emoji, title: title.trim(), content: content.trim(), source: "manual", status: status || "draft" });
  req.session.flash = { success: "Inspiracja została dodana." };
  return res.redirect("/admin/inspirations");
}

async function inspirationEditView(req, res) {
  const inspiration = await inspirationsRepo.findById(req.params.id);
  if (!inspiration) return res.status(404).render("pages/shared/not-found", { pageTitle: "Nie znaleziono", activePage: "" });
  return res.render("pages/admin/inspiration-form", {
    pageTitle: "Edycja inspiracji — Admin",
    activePage: "admin-inspirations",
    inspiration,
    formData: inspiration,
    errors: [],
  });
}

async function inspirationUpdate(req, res) {
  const inspiration = await inspirationsRepo.findById(req.params.id);
  if (!inspiration) return res.status(404).render("pages/shared/not-found", { pageTitle: "Nie znaleziono", activePage: "" });

  const { emoji, title, content, status } = req.body;
  const errors = validateInspiration({ emoji, title, content, status });
  if (errors.length) {
    return res.status(422).render("pages/admin/inspiration-form", {
      pageTitle: "Edycja inspiracji — Admin",
      activePage: "admin-inspirations",
      inspiration,
      formData: { emoji, title, content, status },
      errors,
    });
  }
  await inspirationsRepo.update(req.params.id, { emoji, title: title.trim(), content: content.trim(), status: status || "draft" });
  req.session.flash = { success: "Inspiracja została zaktualizowana." };
  return res.redirect("/admin/inspirations");
}

async function inspirationDelete(req, res) {
  await inspirationsRepo.remove(req.params.id);
  req.session.flash = { success: "Inspiracja została usunięta." };
  return res.redirect("/admin/inspirations");
}

// --- Help Sections CRUD ---

async function helpList(req, res) {
  const sections = await helpRepo.findAll();
  const flash = req.session.flash || {};
  req.session.flash = null;
  return res.render("pages/admin/help-list", {
    pageTitle: "Sekcje pomocy — Admin",
    activePage: "admin-help",
    sections,
    success: flash.success || null,
  });
}

function helpCreateView(req, res) {
  return res.render("pages/admin/help-form", {
    pageTitle: "Nowa sekcja pomocy — Admin",
    activePage: "admin-help",
    section: null,
    formData: {},
    errors: [],
  });
}

async function helpCreate(req, res) {
  const { category, title, body, displayOrder, status } = req.body;
  const errors = validateHelpSection({ category, title, body, displayOrder, status });
  if (errors.length) {
    return res.status(422).render("pages/admin/help-form", {
      pageTitle: "Nowa sekcja pomocy — Admin",
      activePage: "admin-help",
      section: null,
      formData: { category, title, body, displayOrder, status },
      errors,
    });
  }
  await helpRepo.create({ category: (category || "").trim(), title: title.trim(), body: body.trim(), displayOrder: parseInt(displayOrder, 10) || 0, status: status || "draft" });
  req.session.flash = { success: "Sekcja pomocy została dodana." };
  return res.redirect("/admin/help");
}

async function helpEditView(req, res) {
  const section = await helpRepo.findById(req.params.id);
  if (!section) return res.status(404).render("pages/shared/not-found", { pageTitle: "Nie znaleziono", activePage: "" });
  return res.render("pages/admin/help-form", {
    pageTitle: "Edycja sekcji pomocy — Admin",
    activePage: "admin-help",
    section,
    formData: section,
    errors: [],
  });
}

async function helpUpdate(req, res) {
  const section = await helpRepo.findById(req.params.id);
  if (!section) return res.status(404).render("pages/shared/not-found", { pageTitle: "Nie znaleziono", activePage: "" });

  const { category, title, body, displayOrder, status } = req.body;
  const errors = validateHelpSection({ category, title, body, displayOrder, status });
  if (errors.length) {
    return res.status(422).render("pages/admin/help-form", {
      pageTitle: "Edycja sekcji pomocy — Admin",
      activePage: "admin-help",
      section,
      formData: { category, title, body, displayOrder, status },
      errors,
    });
  }
  await helpRepo.update(req.params.id, { category: (category || "").trim(), title: title.trim(), body: body.trim(), displayOrder: parseInt(displayOrder, 10) || 0, status: status || "draft" });
  req.session.flash = { success: "Sekcja pomocy została zaktualizowana." };
  return res.redirect("/admin/help");
}

async function helpDelete(req, res) {
  await helpRepo.remove(req.params.id);
  req.session.flash = { success: "Sekcja pomocy została usunięta." };
  return res.redirect("/admin/help");
}

// --- Anonymous Messages ---

async function messagesList(req, res) {
  const messages = await messagesRepo.findAll();
  const flash = req.session.flash || {};
  req.session.flash = null;
  return res.render("pages/admin/messages-list", {
    pageTitle: "Anonimowe wiadomości — Admin",
    activePage: "admin-messages",
    messages,
    success: flash.success || null,
  });
}

async function messageView(req, res) {
  const message = await messagesRepo.findById(req.params.id);
  if (!message) return res.status(404).render("pages/shared/not-found", { pageTitle: "Nie znaleziono", activePage: "" });
  return res.render("pages/admin/message-view", {
    pageTitle: "Wiadomość — Admin",
    activePage: "admin-messages",
    message,
  });
}

async function messageStatusUpdate(req, res) {
  const { status } = req.body;
  if (!isValidStatus("message", status)) {
    req.session.flash = { success: "Nieprawidłowy status." };
    return res.redirect("/admin/messages");
  }
  await messagesRepo.updateStatus(req.params.id, status);
  req.session.flash = { success: "Status wiadomości został zmieniony." };
  return res.redirect("/admin/messages");
}

async function messageDelete(req, res) {
  await messagesRepo.remove(req.params.id);
  req.session.flash = { success: "Wiadomość została usunięta." };
  return res.redirect("/admin/messages");
}

// --- Entries (user entries admin view) ---

async function entriesList(req, res) {
  const entries = await entriesRepo.findAll();
  const flash = req.session.flash || {};
  req.session.flash = null;
  return res.render("pages/admin/entries-list", {
    pageTitle: "Wpisy użytkowników — Admin",
    activePage: "admin-entries",
    entries,
    success: flash.success || null,
  });
}

async function entryEditView(req, res) {
  const entry = await entriesRepo.findById(req.params.id);
  if (!entry) return res.status(404).render("pages/shared/not-found", { pageTitle: "Nie znaleziono", activePage: "" });
  return res.render("pages/admin/entry-edit", {
    pageTitle: "Edycja wpisu — Admin",
    activePage: "admin-entries",
    entry,
    errors: [],
    statuses: VALID_STATUSES.entry,
  });
}

async function entryUpdate(req, res) {
  const entry = await entriesRepo.findById(req.params.id);
  if (!entry) return res.status(404).render("pages/shared/not-found", { pageTitle: "Nie znaleziono", activePage: "" });

  const { title, body, status } = req.body;
  const errors = [];
  if (!title || !title.trim()) errors.push("Tytuł jest wymagany.");
  if (!body || !body.trim()) errors.push("Treść jest wymagana.");
  if (status && !isValidStatus("entry", status)) errors.push("Nieprawidłowy status.");

  if (errors.length) {
    return res.status(422).render("pages/admin/entry-edit", {
      pageTitle: "Edycja wpisu — Admin",
      activePage: "admin-entries",
      entry: { ...entry, title, body, status },
      errors,
      statuses: VALID_STATUSES.entry,
    });
  }

  await entriesRepo.update(req.params.id, { title: title.trim(), body: body.trim() });
  if (status && status !== entry.status) await entriesRepo.updateStatus(req.params.id, status);
  req.session.flash = { success: "Wpis został zaktualizowany." };
  return res.redirect("/admin/entries");
}

async function entryDelete(req, res) {
  await entriesRepo.remove(req.params.id);
  req.session.flash = { success: "Wpis został usunięty." };
  return res.redirect("/admin/entries");
}

module.exports = {
  dashboard,
  inspirationsList,
  inspirationCreateView,
  inspirationCreate,
  inspirationEditView,
  inspirationUpdate,
  inspirationDelete,
  helpList,
  helpCreateView,
  helpCreate,
  helpEditView,
  helpUpdate,
  helpDelete,
  messagesList,
  messageView,
  messageStatusUpdate,
  messageDelete,
  entriesList,
  entryEditView,
  entryUpdate,
  entryDelete,
};
