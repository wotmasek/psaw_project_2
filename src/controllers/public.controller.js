const inspirationService = require("../services/inspiration.service");
const anonymousBoxService = require("../services/anonymous-box.service");
const helpService = require("../services/help.service");

function home(req, res) {
  return res.render("pages/public/home", {
    pageTitle: "dlaczegozyc.pl — Twoja bezpieczna przestrzeń",
    activePage: "home",
  });
}

async function inspirationWall(req, res) {
  const inspirations = await inspirationService.getPublishedInspirations();
  return res.render("pages/public/inspiration-wall", {
    pageTitle: "Inspiracje — dlaczegozyc.pl",
    activePage: "inspirations",
    inspirations,
  });
}

async function inspirationDetail(req, res) {
  const inspiration = await inspirationService.getInspirationById(req.params.id);
  if (!inspiration || inspiration.status !== "published") {
    return res.status(404).render("pages/shared/not-found", {
      pageTitle: "Nie znaleziono inspiracji",
      activePage: "inspirations",
    });
  }
  return res.render("pages/public/inspiration-detail", {
    pageTitle: "Inspiracja — dlaczegozyc.pl",
    activePage: "inspirations",
    inspiration,
  });
}

async function inspirationGeneratorGet(req, res) {
  const lastInspiration = await inspirationService.getLastGenerated();
  return res.render("pages/public/inspiration-generator", {
    pageTitle: "Generator inspiracji — dlaczegozyc.pl",
    activePage: "inspirations",
    result: null,
    lastInspiration,
  });
}

async function inspirationGeneratorPost(req, res) {
  const mood = req.body.mood || "calm";
  const result = await inspirationService.generateFromMood(mood);
  const lastInspiration = await inspirationService.getLastGenerated();
  return res.render("pages/public/inspiration-generator", {
    pageTitle: "Twoja inspiracja — dlaczegozyc.pl",
    activePage: "inspirations",
    result,
    lastInspiration,
  });
}

function anonymousBoxGet(req, res) {
  return res.render("pages/public/anonymous-box", {
    pageTitle: "Anonimowa skrzynka — dlaczegozyc.pl",
    activePage: "anonymous-box",
    flash: null,
  });
}

async function anonymousBoxPost(req, res) {
  const result = await anonymousBoxService.submitMessage(req.body.body);
  if (!result.ok) {
    return res.render("pages/public/anonymous-box", {
      pageTitle: "Anonimowa skrzynka — dlaczegozyc.pl",
      activePage: "anonymous-box",
      flash: { error: result.error },
    });
  }
  return res.redirect("/anonymous-box/sent");
}

function anonymousBoxSent(req, res) {
  return res.render("pages/public/anonymous-box-sent", {
    pageTitle: "Wiadomość wysłana — dlaczegozyc.pl",
    activePage: "anonymous-box",
  });
}

async function help(req, res) {
  const helpSections = await helpService.getPublishedSections();
  return res.render("pages/public/help", {
    pageTitle: "Pomoc — dlaczegozyc.pl",
    activePage: "help",
    helpSections,
  });
}

module.exports = {
  home,
  inspirationWall,
  inspirationDetail,
  inspirationGeneratorGet,
  inspirationGeneratorPost,
  anonymousBoxGet,
  anonymousBoxPost,
  anonymousBoxSent,
  help,
};
