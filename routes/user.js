const express= require("express");
const router = express.Router();
const User = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const {redirectUrl} = require("../middleware.js");

const usercontroller = require("../controllers/users.js");

router.get("/signup",usercontroller.rendersignupform);


router.post("/signup",wrapasync(usercontroller.signup));



router.get("/login",usercontroller.renderloginform);


router.post("/login",redirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),usercontroller.login);

router.get("/logout",usercontroller.logout);

module.exports = router;
