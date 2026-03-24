const express = require("express");
const controller = require("../controllers/auth.controller");
const { csrfProtection } = require("../middleware/csrf-protection");

const router = express.Router();

router.get("/register", controller.registerView);
router.post("/register", csrfProtection, controller.register);

router.get("/login", controller.loginView);
router.post("/login", csrfProtection, controller.login);

router.post("/logout", csrfProtection, controller.logout);
router.get("/auth-required", controller.authRequiredView);

module.exports = router;

