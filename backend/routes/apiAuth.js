const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users.js");

router.post("/signup", UserController.signupApi);
router.post("/login", UserController.loginApi);
router.post("/logout", UserController.logoutApi);
router.get("/session", UserController.sessionApi);

module.exports = router;
