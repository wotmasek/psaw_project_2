function validateRegister({ login, password, passwordConfirmation }) {
  const errors = [];

  if (!login || login.trim().length < 3) {
    errors.push("Login musi mieć co najmniej 3 znaki.");
  }
  if (login && login.trim().length > 60) {
    errors.push("Login może mieć maksymalnie 60 znaków.");
  }
  if (login && !/^[a-zA-Z0-9_.-]+$/.test(login.trim())) {
    errors.push("Login może zawierać tylko litery, cyfry, kropki, myślniki i podkreślniki.");
  }
  if (!password || password.length < 6) {
    errors.push("Hasło musi mieć co najmniej 6 znaków.");
  }
  if (password !== passwordConfirmation) {
    errors.push("Hasła nie są identyczne.");
  }

  return errors;
}

function validateLogin({ login, password }) {
  const errors = [];
  if (!login || !login.trim()) errors.push("Podaj login.");
  if (!password) errors.push("Podaj hasło.");
  return errors;
}

function validateForgotPassword({ email }) {
  const errors = [];
  if (!email || !email.trim()) {
    errors.push("Podaj adres e-mail.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("Podaj poprawny adres e-mail.");
  }
  return errors;
}

function validateResetPassword({ password, passwordConfirmation }) {
  const errors = [];
  if (!password || password.length < 6) {
    errors.push("Nowe hasło musi mieć co najmniej 6 znaków.");
  }
  if (password !== passwordConfirmation) {
    errors.push("Hasła nie są identyczne.");
  }
  return errors;
}

function validateChangePassword({ currentPassword, newPassword, newPasswordConfirmation }) {
  const errors = [];
  if (!currentPassword) errors.push("Podaj aktualne hasło.");
  if (!newPassword || newPassword.length < 6) {
    errors.push("Nowe hasło musi mieć co najmniej 6 znaków.");
  }
  if (newPassword !== newPasswordConfirmation) {
    errors.push("Nowe hasła nie są identyczne.");
  }
  return errors;
}

function validateProfile({ firstName, lastName }) {
  const errors = [];
  if (firstName && firstName.length > 100) errors.push("Imię jest za długie.");
  if (lastName && lastName.length > 100) errors.push("Nazwisko jest za długie.");
  return errors;
}

function validateEmail({ email }) {
  const errors = [];
  if (!email || !email.trim()) {
    errors.push("Podaj adres e-mail.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("Podaj poprawny adres e-mail.");
  }
  return errors;
}

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateProfile,
  validateEmail,
};
