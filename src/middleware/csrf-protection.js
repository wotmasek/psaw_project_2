function csrfProtection(req, res, next) {
  // Celowo lekki placeholder dla szkicu MVP.
  // W etapie implementacji należy podpiąć realną bibliotekę CSRF
  // i wstrzykiwać token do formularzy EJS.
  res.locals.csrfToken = "";
  next();
}

module.exports = {
  csrfProtection
};

