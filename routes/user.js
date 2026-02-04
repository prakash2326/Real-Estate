const express = require("express");
const router = express.Router();
// const wrapAsync =require("../utils/wrapAsync.js");
const UserController = require("../controllers/users.js")
const passport =require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router
    .route("/signup")
    .get(UserController.renderSignUpForm)
    .post(UserController.Signup)

router
    .route("/login")
    .get(UserController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
    }),UserController.login);

    
router.get("/logout",UserController.logout);

module.exports = router;    