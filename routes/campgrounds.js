var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    // {} all campgrounds
    console.log(req.user);
    Campground.find({}, function(err, AllCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: AllCampgrounds}); //current userként átadjuk a user-t
        }
    })
        //res.render("campgrounds", {campgrounds: campgrounds})
})

//CREATE - add new campground to the DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campground array
    //redirect back to campgroound here
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description; // name attribute from html
    var author =  {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
   
    console.log(req.user);
    // Create a new campground and save database
    Campground.create(
        newCampground, function(err,newlyCreated) {
            if(err) {
                console.log(err);
            } else {
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
    
});


//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")
})



//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided id
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            console.log(foundCampground);
            //render show template that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})


//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){  
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    })
})
 
//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgorunds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})





module.exports = router;