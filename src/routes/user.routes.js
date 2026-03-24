const express = require("express");
const controller = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/require-auth");
const { csrfProtection } = require("../middleware/csrf-protection");

const router = express.Router();

router.get("/dashboard", requireAuth, controller.dashboard);
router.get("/my-entries", requireAuth, controller.myEntries);
router.get("/entries/new", requireAuth, controller.createEntryView);
router.post("/entries", requireAuth, csrfProtection, controller.createEntry);
router.get("/entries/:id/edit", requireAuth, controller.editEntryView);
router.post("/entries/:id", requireAuth, csrfProtection, controller.editEntry);

module.exports = router;

