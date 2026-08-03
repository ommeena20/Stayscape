const express = require("express");
const router = express.Router({ mergeParams: true });

const passport = require("passport");

const { redirectsave, loginLimiter } = require("../middleware");

const Wrapasync = require("../utility/Wrapasync");
const Clientcontroller = require("../controllers/Client");



router.route("/signup")
    .get(Clientcontroller.signupForm)
    .post(
        loginLimiter,
        Wrapasync(Clientcontroller.signup)
    );

router.route("/login")
    .get(Clientcontroller.loginForm)
    .post(
        loginLimiter,
        redirectsave,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        Clientcontroller.login
    );

    
  router.route("/users")
  .get(Wrapasync(Clientcontroller.showUsers))


router.get("/logout", Clientcontroller.logout);

module.exports = router;