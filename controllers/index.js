const User = require('../models/user');
const passport = require("passport");


module.exports = {
    async postRegister(req, res, next){
        const newUser = new User({username: req.body.username});
        await User.register(newUser, req.body.password)
           // passport.authenticate("local")(req, res, () => {  //local strategy
                req.flash("success", "Welcome to the YelpCamp " + newUser.username);
                res.redirect("/campgrounds");            
            //})
    },
     postLogin(req, res, next){
        passport.authenticate("local", {                                                      
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        })(req, res, next);
    }, 

    getLogout(req, res, next){
        req.logout();
        req.flash("success", "logged you out");
        res.redirect("/campgrounds");
    }
}
//     req.flash("success", "logged you out");
//     res.redirect("/campgrounds");
    
    //     req.flash("success", "logged you out");
    //     res.redirect("/campgrounds");

    //     let newUser = new User({username: req.body.username});
    //     User.register(newUser, req.body.password, (err, user) => {  //register() provided by passport local mongoose package
    //         // if(err){                                                //a register() hasheli
    //         //     console.log(err);
    //         //     req.flash("error", err.message); //err coming from password
    //         //     return res.render("register")
    //         // }
    //         if(err){
    //             console.log(err);
    //             return res.render("register", {error: err.message});
    //         }
    //         passport.authenticate("local")(req, res, () => {  //local strategy
    //             req.flash("success", "Welcome to the YelpCamp " + user.username);
    //             res.redirect("/campgrounds");            
    //         })
    // })  
    // }

    