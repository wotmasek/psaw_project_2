const express = require("express");
const controller = require("../controllers/public.controller");
const { csrfProtection } = require("../middleware/csrf-protection");

const router = express.Router();

router.get("/", controller.home);

router.get("/inspirations", controller.inspirationWall);
router.get("/inspirations/generator", controller.inspirationGeneratorGet);
router.post("/inspirations/generator", csrfProtection, controller.inspirationGeneratorPost);
router.get("/inspirations/:id", controller.inspirationDetail);

router.get("/anonymous-box", controller.anonymousBoxGet);
router.post("/anonymous-box", csrfProtection, controller.anonymousBoxPost);
router.get("/anonymous-box/sent", controller.anonymousBoxSent);

router.get("/help", controller.help);

module.exports = router;
