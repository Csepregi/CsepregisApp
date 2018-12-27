var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing")
});


// =========
//AUTH ROUTES
//show register form
//
router.get("/register", function(req, res){
    res.render("register");
}); 

//Sign up logic
//registráljuk és utána login in
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {  //register() provided by passport local mongoose package
            if(err){                                                //a register() hasheli
                console.log(err);
                req.flash("error", err.message); //err coming from password
                return res.render("register")
            }
            passport.authenticate("local")(req, res, function(){  //local strategy
                req.flash("success", "Welcome to the YelpCamp " + user.username);
                res.redirect("/campgrounds");            
            })
    })  
})

//show login form
router.get("/login", function(req, res){
    res.render("login");//under the key of message we run the message what we defined in the middleware
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
