function setFlash(req, payload) {
  req.session.flash = payload;
}

function consumeFlash(req) {
  const flash = req.session.flash || null;
  delete req.session.flash;
  return flash;
}

module.exports = {
  setFlash,
  consumeFlash
};

