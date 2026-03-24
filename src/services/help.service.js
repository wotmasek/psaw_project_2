const helpRepo = require("../repositories/help-sections.repository");

async function getPublishedSections() {
  return helpRepo.findPublished();
}

module.exports = {
  getPublishedSections,
};
