const usersRepo = require("../repositories/users.repository");
const passwordLib = require("../lib/password");

async function updateProfile(userId, { firstName, lastName }) {
  return usersRepo.updateProfile(userId, { firstName, lastName });
}

async function updateEmail(userId, email) {
  if (email && email.trim()) {
    const taken = await usersRepo.emailExists(email.trim(), userId);
    if (taken) return { error: "Ten adres e-mail jest już używany." };
  }
  const user = await usersRepo.updateEmail(userId, email ? email.trim() : null);
  return { user };
}

async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await usersRepo.findById(userId);
  if (!user) return { error: "Nie znaleziono użytkownika." };

  const valid = await passwordLib.verify(currentPassword, user.password_hash);
  if (!valid) return { error: "Aktualne hasło jest nieprawidłowe." };

  const hash = await passwordLib.hash(newPassword);
  await usersRepo.updatePasswordHash(userId, hash);
  return { ok: true };
}

module.exports = { updateProfile, updateEmail, changePassword };
