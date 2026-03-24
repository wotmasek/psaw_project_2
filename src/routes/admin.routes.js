const express = require("express");
const controller = require("../controllers/admin.controller");
const { requireAdmin } = require("../middleware/require-admin");
const { csrfProtection } = require("../middleware/csrf-protection");

const router = express.Router();

router.get("/admin", requireAdmin, controller.dashboard);
router.get("/admin/entries", requireAdmin, controller.entries);
router.get("/admin/entries/:kind/:id/edit", requireAdmin, controller.editEntryView);
router.post("/admin/entries/:kind/:id", requireAdmin, csrfProtection, controller.editEntry);
router.post("/admin/entries/:kind/:id/status", requireAdmin, csrfProtection, controller.updateStatus);
router.post("/admin/entries/:kind/:id/delete", requireAdmin, csrfProtection, controller.deleteEntry);
router.get("/admin/help/edit", requireAdmin, controller.helpEditView);
router.post("/admin/help/:id", requireAdmin, csrfProtection, controller.helpUpdate);

module.exports = router;

