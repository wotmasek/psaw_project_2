function dashboard(req, res) {
  return res.render("pages/user/dashboard", { pageTitle: "Panel użytkownika" });
}

function myEntries(req, res) {
  return res.render("pages/user/my-entries", { pageTitle: "Moje wpisy" });
}

function createEntryView(req, res) {
  return res.render("pages/user/entry-create", { pageTitle: "Nowy wpis" });
}

function createEntry(req, res) {
  // Placeholder CRUD dla szkicu MVP.
  return res.redirect("/my-entries");
}

function editEntryView(req, res) {
  return res.render("pages/user/entry-edit", { pageTitle: "Edycja wpisu" });
}

function editEntry(req, res) {
  // Placeholder CRUD dla szkicu MVP.
  return res.redirect("/my-entries");
}

module.exports = {
  dashboard,
  myEntries,
  createEntryView,
  createEntry,
  editEntryView,
  editEntry
};

