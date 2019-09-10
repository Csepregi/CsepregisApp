const User = require('../models/user');
const passport = require("passport");


module.exports = {

    getRegister(req, res, next)  {
        res.render("register", {page:'register'});
    },

    async postRegister(req, res, next){
        const newUser = new User({username: req.body.username});
        //await User.register(newUser, req.body.password)
           // passport.authenticate("local")(req, res, () => {  //local strategy
                //req.flash("success", "Welcome to the YelpCamp " + newUser.username);
                //res.redirect("/campgrounds");            
            //})
            let user = await User.register(newUser, req.body.password);
            req.login(user, function(err) {
              if (err) { return next(err); }
              req.session.success = `Welcome to Surf Shop, ${user.username}!`;
              res.redirect('/campgrounds');
            });
    },

    getLogin(req, res, next) {
        res.render("login", {page:'login'});//under the key of message we run the message what we defined in the middleware
    },

    async postLogin(req, res, next){
        const {username, password} = req.body;
        const {user, err} = await User.authenticate()(username, passport);
        if(!user && error) return next(error);
        res.login(user, function(err){
            if(err) return next(err);
            req.session.success = `Welcome back ${username}!`;
            const redirectUrl = req.session.redirectTo || '/campgrounds';
            delete req.session.redirectTo;
            res.redirect(redirectUrl);
        });
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

    