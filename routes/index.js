const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
var { getRegister, postRegister, getLogin, postLogin, getLogout } = require('../controllers/index');
const {errorHandler} = require('../middleware');

//root route
router.get("/", (req, res) => {
    res.render("landing")
});
// =========
//AUTH ROUTES
//show register form
//
router.get("/register", getRegister);


//Sign up logic
//registration and then login in
router.post("/register", errorHandler(postRegister));

//show login form
router.get("/login", getLogin);


router.post("/login", errorHandler(postLogin));


//logic logout route
router.get("/logout", getLogout);


//middleware
function isLoggedIn(req, res, next){    
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;
