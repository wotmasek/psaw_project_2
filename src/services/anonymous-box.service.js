const messagesRepo = require("../repositories/anonymous-messages.repository");

async function submitMessage(body) {
  const trimmed = (body || "").trim();
  if (!trimmed || trimmed.length < 5) {
    return { ok: false, error: "Wiadomość musi mieć co najmniej 5 znaków." };
  }
  if (trimmed.length > 5000) {
    return { ok: false, error: "Wiadomość jest za długa (max 5000 znaków)." };
  }
  const result = await messagesRepo.create({ body: trimmed });
  return { ok: true, id: result.id };
}

module.exports = {
  submitMessage,
};
