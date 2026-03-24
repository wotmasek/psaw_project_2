const express = require("express");
const controller = require("../controllers/public.controller");
const { csrfProtection } = require("../middleware/csrf-protection");

const router = express.Router();

router.get("/", controller.home);
router.get("/inspirations", controller.inspirationWall);
router.get("/inspirations/:id", controller.inspirationDetail);
router.get("/inspirations/generator", controller.inspirationGenerator);
router.post("/inspirations/generator", csrfProtection, controller.inspirationGenerator);

router.get("/anonymous-box", controller.anonymousBox);
router.post("/anonymous-box", csrfProtection, controller.anonymousBox);
router.get("/anonymous-box/sent", controller.anonymousBoxSent);

router.get("/help", controller.help);

module.exports = router;

