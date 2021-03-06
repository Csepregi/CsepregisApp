var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require('../models/user');

// all the middleare goes here
module.exports = {

    errorHandler: (fn) => 
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    },

    checkCampgroundOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }  else {
            // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
        }
        });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
        }
    },

    checkCommentOwnership (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }  else {
            // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "you don't have permission to do that");
                res.redirect("back");
            }
        }
        });
    } else {
        req.flash("error", "you need to be logged in to do that");
        res.redirect("back");
        }
    },

    // this fn can be anywhere , => the user have to be loged in
    isLoggedIn (req, res, next){ 
    if(req.isAuthenticated())return next();
    req.flash("error", "Please login first"); //already do not write anything
    req.session.redirectTo = req.originalUrl;
    res.redirect("/login");
    }

}
