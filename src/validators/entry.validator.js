function validateEntry({ title, body }) {
  const errors = [];
  if (!title || !title.trim()) errors.push("Tytuł jest wymagany.");
  if (title && title.length > 200) errors.push("Tytuł może mieć maksymalnie 200 znaków.");
  if (!body || !body.trim()) errors.push("Treść jest wymagana.");
  return errors;
}

module.exports = { validateEntry };
