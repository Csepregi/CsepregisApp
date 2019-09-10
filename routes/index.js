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
// router.get("/register", (req, res) => {
//     res.render("register", {page:'register'});
// }); 

//Sign up logic
//registration and then login in
router.post("/register", errorHandler(postRegister));

// (req, res) => {
//     let newUser = new User({username: req.body.username});
//     User.register(newUser, req.body.password, (err, user) => {  //register() provided by passport local mongoose package
//             // if(err){                                                //a register() hasheli
//             //     console.log(err);
//             //     req.flash("error", err.message); //err coming from password
//             //     return res.render("register")
//             // }
//             if(err){
//                 console.log(err);
//                 return res.render("register", {error: err.message});
//             }
//             passport.authenticate("local")(req, res, () => {  //local strategy
//                 req.flash("success", "Welcome to the YelpCamp " + user.username);
//                 res.redirect("/campgrounds");            
//             })
//     })  
// })

//show login form
router.get("/login", getLogin);
// router.get("/login", (req, res) => {
//     res.render("login", {page:'login'});//under the key of message we run the message what we defined in the middleware
// })
//handling login logis //middleware and callback
//vizsgálja , hogy a user létezik e már 
router.post("/login", errorHandler(postLogin));
// passport.authenticate("local",   //use  LocalStrategy
// {                                                       //authenticate comes from passport local mongoose package
//     successRedirect: "/campgrounds",
//     failureRedirect: "/login"
// }), function(req, res){
// });

//logic logout route
router.get("/logout", getLogout);
//  function(req, res){
//     req.logout();
//     req.flash("success", "logged you out");
//     res.redirect("/campgrounds");
// })

//middleware
function isLoggedIn(req, res, next){    
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;
