var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
  };
   
  var geocoder = NodeGeocoder(options);

//INDEX - show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    // {} all campgrounds
    console.log(req.user);
    Campground.find({}, function(err, AllCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: AllCampgrounds, currentUser: req.user}); //pass the user as current user
                                            //campgrounds the name, AllCampgrounds the data
        }
    })
        //res.render("campgrounds", {campgrounds: campgrounds})
})

//CREATE - add new campground to the DB
// router.post("/", middleware.isLoggedIn, function(req, res){
//     //get data from form and add to campground array
//     //redirect back to campgroound here
//     var name = req.body.name;
//     var image = req.body.image;
//     var price = req.body.price;
//     var desc = req.body.description; // name attribute from html
//     var author =  {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newCampground = {name: name, price: price, image: image, description: desc, author: author};
   
//     console.log(req.user);
//     // Create a new campground and save database
//     Campground.create(
//         newCampground, function(err,newlyCreated) {
//             if(err) {
//                 console.log(err);
//             } else {
//                 console.log(newlyCreated);
//                 res.redirect("/campgrounds");
//             }
//         });
    
// });

router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        console.log(err);
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              //redirect back to campgrounds page
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
    });
  });
  
// Campground.create({
//     name: "Basilicata",
//     image: "https://images.unsplash.com/photo-1499174549139-68d3f37243b4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     price: 40,
//     desc: "Matera"
// }
//     , function(err,newlyCreated) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log(newlyCreated);
//             //res.redirect("/campgrounds");
//         }
//     });

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
// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//     //find and update the correct campground
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//         if(err) {
//             res.redirect("/campgrounds");
//         } else {
//             res.redirect("/campgrounds/" + req.params.id);
//         }
//     });
// })
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });

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