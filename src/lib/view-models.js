function baseViewModel(overrides = {}) {
  return {
    pageTitle: "dlaczegozyc.pl",
    message: null,
    ...overrides
  };
}

module.exports = {
  baseViewModel
};

