var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", (req, res) => {
    res.render("landing")
});


// =========
//AUTH ROUTES
//show register form
//
router.get("/register", (req, res) => {
    res.render("register", {page:'register'});
}); 

//Sign up logic
//registráljuk és utána login in
router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {  //register() provided by passport local mongoose package
            // if(err){                                                //a register() hasheli
            //     console.log(err);
            //     req.flash("error", err.message); //err coming from password
            //     return res.render("register")
            // }
            if(err){
                console.log(err);
                return res.render("register", {error: err.message});
            }
            passport.authenticate("local")(req, res, () => {  //local strategy
                req.flash("success", "Welcome to the YelpCamp " + user.username);
                res.redirect("/campgrounds");            
            })
    })  
})

//show login form
router.get("/login", (req, res) => {
    res.render("login", {page:'login'});//under the key of message we run the message what we defined in the middleware
})
//handling login logis //middleware and callback
//vizsgálja , hogy a user létezik e már 
router.post("/login", passport.authenticate("local",   //a local a LocalStrategy -t használja
{                                                       //az authenticate a passport local mongoose package ből jön
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//logic logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
})

//middleware
function isLoggedIn(req, res, next){   // ezt a függvényt bárhova tehetjük ahol azt akarjuk , hogy a felhasználó legyen bejelentkezve
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;
