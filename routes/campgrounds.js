var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
var multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'surfshop', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
  };
   
  var geocoder = NodeGeocoder(options);

//INDEX - show all campgrounds
router.get("/", (req, res) => {
    //Get all campgrounds from DB
    // {} all campgrounds
    console.log(req.user);
    Campground.find({}, (err, AllCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: AllCampgrounds, currentUser: req.user, page: 'campgrounds'}); //pass the user as current user
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

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      // add image's public_id to campground object
      req.body.campground.imageId = result.public_id;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      geocoder.geocode(req.body.location, (err, data) => {
              if (err || !data.length) {
                console.log(err);
                req.flash('error', 'Invalid address');
                return res.redirect('back');
              }
            req.body.campground.lat = data[0].latitude;
            req.body.campground.lng = data[0].longitude;
            req.body.campground.location = data[0].formattedAddress;
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
    });
});
});


// router.post("/", middleware.isLoggedIn, (req, res) => {
//     // get data from form and add to campgrounds array
//     var name = req.body.name;
//     var image = req.body.image;
//     var price = req.body.price;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     };
//     geocoder.geocode(req.body.location, (err, data) => {
//       if (err || !data.length) {
//         console.log(err);
//         req.flash('error', 'Invalid address');
//         return res.redirect('back');
//       }
//       var lat = data[0].latitude;
//       var lng = data[0].longitude;
//       var location = data[0].formattedAddress;
//       var newCampground = {name: name, image: image,price:price, description: desc, author:author, location: location, lat: lat, lng: lng};
//       // Create a new campground and save to DB
//       Campground.create(newCampground, (err, newlyCreated) => {
//           if(err){
//               console.log(err);
//           } else {
//               //redirect back to campgrounds page
//               console.log(newlyCreated);
//               res.redirect("/campgrounds");
//           }
//       });
//     });
//   });

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})



//SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
    //find the campground with provided id
    
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
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
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {  
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});
    })
})
 

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    var newData = {name: req.body.name, image: req.body.image,price: req.body.price, description: req.body.desc};
    geocoder.geocode(req.body.location,  (err, data) => {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
       Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        // Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
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
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/campgorunds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})


module.exports = router;