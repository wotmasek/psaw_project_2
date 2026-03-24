function notFoundHandler(req, res) {
  return res.status(404).render("pages/shared/not-found", {
    pageTitle: "Nie znaleziono strony",
    activePage: "",
  });
}

function errorHandler(error, req, res, next) {
  // eslint-disable-next-line no-console
  console.error("[dlaczegozyc] request error:", error);
  if (res.headersSent) {
    return next(error);
  }
  return res.status(500).render("pages/shared/error", {
    pageTitle: "Wystąpił błąd",
    activePage: "",
    message: null,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
