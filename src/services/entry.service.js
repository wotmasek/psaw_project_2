const entriesRepo = require("../repositories/entries.repository");

async function getUserEntries(userId) {
  return entriesRepo.findByUserId(userId);
}

async function getEntryById(id) {
  return entriesRepo.findById(id);
}

async function createEntry(userId, { title, body }) {
  return entriesRepo.create({ userId, title: title.trim(), body: body.trim() });
}

async function updateEntry(id, { title, body }) {
  return entriesRepo.update(id, { title: title.trim(), body: body.trim() });
}

module.exports = {
  getUserEntries,
  getEntryById,
  createEntry,
  updateEntry,
};
