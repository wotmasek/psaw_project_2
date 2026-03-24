function validateInspiration({ emoji, title, content, status }) {
  const errors = [];
  if (!title || !title.trim()) errors.push("Tytuł jest wymagany.");
  if (title && title.length > 200) errors.push("Tytuł może mieć max 200 znaków.");
  if (!content || !content.trim()) errors.push("Treść jest wymagana.");
  if (status && !["draft", "published", "archived"].includes(status)) {
    errors.push("Nieprawidłowy status.");
  }
  return errors;
}

function validateHelpSection({ category, title, body, displayOrder, status }) {
  const errors = [];
  if (!title || !title.trim()) errors.push("Tytuł jest wymagany.");
  if (title && title.length > 200) errors.push("Tytuł może mieć max 200 znaków.");
  if (!body || !body.trim()) errors.push("Treść jest wymagana.");
  if (status && !["draft", "published"].includes(status)) {
    errors.push("Nieprawidłowy status.");
  }
  return errors;
}

const VALID_STATUSES = {
  entry: ["active", "saved", "archived"],
  inspiration: ["draft", "published", "archived"],
  message: ["new", "reviewed", "archived"],
  help: ["draft", "published"],
};

function isValidStatus(kind, status) {
  return (VALID_STATUSES[kind] || []).includes(status);
}

module.exports = { validateInspiration, validateHelpSection, isValidStatus, VALID_STATUSES };
