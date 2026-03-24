function home(req, res) {
  return res.render("pages/public/home", { pageTitle: "dlaczegozyc.pl" });
}

function inspirationWall(req, res) {
  return res.status(501).render("pages/shared/error", {
    pageTitle: "Ściana inspiracji - szkic",
    message: "Moduł ściany inspiracji nie jest jeszcze zaimplementowany."
  });
}

function inspirationDetail(req, res) {
  return res.status(501).render("pages/shared/error", {
    pageTitle: "Szczegół inspiracji - szkic",
    message: "Moduł szczegółu inspiracji nie jest jeszcze zaimplementowany."
  });
}

function inspirationGenerator(req, res) {
  return res.status(501).render("pages/shared/error", {
    pageTitle: "Generator inspiracji - szkic",
    message: "Moduł generatora inspiracji nie jest jeszcze zaimplementowany."
  });
}

function anonymousBox(req, res) {
  return res.status(501).render("pages/shared/error", {
    pageTitle: "Anonimowa skrzynka - szkic",
    message: "Moduł anonimowej skrzynki nie jest jeszcze zaimplementowany."
  });
}

function anonymousBoxSent(req, res) {
  return res.render("pages/public/anonymous-box-sent", {
    pageTitle: "Wysłano wiadomość"
  });
}

function help(req, res) {
  return res.status(501).render("pages/shared/error", {
    pageTitle: "Sekcja pomocy - szkic",
    message: "Moduł sekcji pomocy nie jest jeszcze zaimplementowany."
  });
}

module.exports = {
  home,
  inspirationWall,
  inspirationDetail,
  inspirationGenerator,
  anonymousBox,
  anonymousBoxSent,
  help
};

