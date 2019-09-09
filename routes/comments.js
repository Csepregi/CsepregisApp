const express = require("express");
const router = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const {isLoggedIn, checkCommentOwnership} = require("../middleware");


//==========================
//COMMENTS ROUTES
//==================
//comments new
router.get("/new", isLoggedIn, (req, res) => {
    console.log(req.params.id);
    Campground.findById(req.params.id, (err, campground) => {
        
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})
//comments create
router.post("/", isLoggedIn,  (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
           // console.log(req.body.comment);
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "something went wrong");
                    console.log(err);
                } else {   //assocsiate comment to campground
                    //add username and id to the comment
                    //save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "successfully added comment");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    })
    //create new comment
    //connect new comment to campground
    //redirect campground shop page
})

//comment edit route

router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment })

        }
    })
})

//comment update route

router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});


module.exports = router;

