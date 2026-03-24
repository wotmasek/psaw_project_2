const express = require("express");
const c = require("../controllers/admin.controller");
const { requireAdmin } = require("../middleware/require-admin");
const { csrfProtection } = require("../middleware/csrf-protection");

const router = express.Router();

router.get("/admin", requireAdmin, c.dashboard);

// Inspirations
router.get("/admin/inspirations", requireAdmin, c.inspirationsList);
router.get("/admin/inspirations/new", requireAdmin, c.inspirationCreateView);
router.post("/admin/inspirations", requireAdmin, csrfProtection, c.inspirationCreate);
router.get("/admin/inspirations/:id/edit", requireAdmin, c.inspirationEditView);
router.post("/admin/inspirations/:id", requireAdmin, csrfProtection, c.inspirationUpdate);
router.post("/admin/inspirations/:id/delete", requireAdmin, csrfProtection, c.inspirationDelete);

// Help sections
router.get("/admin/help", requireAdmin, c.helpList);
router.get("/admin/help/new", requireAdmin, c.helpCreateView);
router.post("/admin/help", requireAdmin, csrfProtection, c.helpCreate);
router.get("/admin/help/:id/edit", requireAdmin, c.helpEditView);
router.post("/admin/help/:id", requireAdmin, csrfProtection, c.helpUpdate);
router.post("/admin/help/:id/delete", requireAdmin, csrfProtection, c.helpDelete);

// Anonymous messages
router.get("/admin/messages", requireAdmin, c.messagesList);
router.get("/admin/messages/:id", requireAdmin, c.messageView);
router.post("/admin/messages/:id/status", requireAdmin, csrfProtection, c.messageStatusUpdate);
router.post("/admin/messages/:id/delete", requireAdmin, csrfProtection, c.messageDelete);

// User entries
router.get("/admin/entries", requireAdmin, c.entriesList);
router.get("/admin/entries/:id/edit", requireAdmin, c.entryEditView);
router.post("/admin/entries/:id", requireAdmin, csrfProtection, c.entryUpdate);
router.post("/admin/entries/:id/delete", requireAdmin, csrfProtection, c.entryDelete);

module.exports = router;
