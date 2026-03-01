const express = require("express");
const router = express.Router();
// const wrapAsync =require("../utils/wrapAsync.js");
const UserController = require("../controllers/users.js")
const {saveRedirectUrl} = require("../middleware.js");

router
    .route("/signup")
    .get(UserController.renderSignUpForm)
    .post(UserController.Signup)

router
    .route("/login")
    .get(UserController.renderLoginForm)
    .post(saveRedirectUrl,UserController.authenticateByRole,UserController.login);

    
router.get("/logout",UserController.logout);

module.exports = router;    
