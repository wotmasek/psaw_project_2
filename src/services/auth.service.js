const crypto = require("crypto");
const usersRepo = require("../repositories/users.repository");
const resetRepo = require("../repositories/password-reset.repository");
const password = require("../lib/password");
const { sendMail } = require("../lib/mailer");
const env = require("../config/env");

const RESET_TOKEN_EXPIRY_HOURS = 1;

async function register({ login, plainPassword, email }) {
  const exists = await usersRepo.loginExists(login.trim());
  if (exists) {
    return { error: "Taki login jest już zajęty." };
  }

  if (email && email.trim()) {
    const emailTaken = await usersRepo.emailExists(email.trim());
    if (emailTaken) {
      return { error: "Ten adres e-mail jest już używany." };
    }
  }

  const hash = await password.hash(plainPassword);
  const user = await usersRepo.create({
    login: login.trim(),
    passwordHash: hash,
    email: email ? email.trim() : null,
  });
  return { user };
}

async function authenticate({ login, plainPassword }) {
  const user = await usersRepo.findByLogin(login.trim());
  if (!user) return { error: "Nie udało się zalogować. Sprawdź login i hasło." };

  const valid = await password.verify(plainPassword, user.password_hash);
  if (!valid) return { error: "Nie udało się zalogować. Sprawdź login i hasło." };

  return { user };
}

function buildSessionUser(dbUser) {
  return {
    id: dbUser.id,
    login: dbUser.login,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    isAdmin: dbUser.is_admin,
  };
}

async function requestPasswordReset(email) {
  const user = await usersRepo.findByEmail(email.trim());
  if (!user) return { ok: true };

  await resetRepo.invalidateForUser(user.id);

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await resetRepo.create({ userId: user.id, tokenHash, expiresAt });

  const resetUrl = `${env.appBaseUrl}/reset-password/${token}`;

  try {
    await sendMail({
      to: user.email,
      subject: "Reset hasła — dlaczegozyc.pl",
      text: `Kliknij poniższy link, aby ustawić nowe hasło:\n\n${resetUrl}\n\nLink wygasa za ${RESET_TOKEN_EXPIRY_HOURS} godzinę.\n\nJeśli to nie Ty, zignoruj tę wiadomość.`,
      html: `<p>Kliknij poniższy link, aby ustawić nowe hasło:</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>Link wygasa za ${RESET_TOKEN_EXPIRY_HOURS} godzinę.</p>
<p>Jeśli to nie Ty, zignoruj tę wiadomość.</p>`,
    });
  } catch (err) {
    console.error("Password reset email failed:", err.message);
  }

  return { ok: true };
}

async function resetPassword(token, newPlainPassword) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const record = await resetRepo.findValidByTokenHash(tokenHash);

  if (!record) {
    return { error: "Link do resetu hasła jest nieprawidłowy lub wygasł." };
  }

  const hash = await password.hash(newPlainPassword);
  await usersRepo.updatePasswordHash(record.user_id, hash);
  await resetRepo.markUsed(record.id);
  await resetRepo.invalidateForUser(record.user_id);

  return { ok: true };
}

module.exports = {
  register,
  authenticate,
  buildSessionUser,
  requestPasswordReset,
  resetPassword,
};
