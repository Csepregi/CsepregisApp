const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const {errorHandler, isLoggedIn, checkCampgroundOwnership} = require("../middleware");
// var NodeGeocoder = require('node-geocoder');
const request = require("request");
const multer = require('multer');
const upload = multer({ 'dest': 'uploads/', fileFilter: imageFilter});
 
var { getCampgrounds,
      newCampground,
      createCampground,
      editCampground,
      showCampground,
      getEditCampground,
      takeLike,
      deletePost
    } = require('../controllers/campgrounds');

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


//INDEX - show all campgrounds
router.get("/", errorHandler(getCampgrounds));

//NEW - show form to create new campground
router.get("/new", isLoggedIn, newCampground);

router.post("/",upload.array('images', 2), isLoggedIn, errorHandler(createCampground))
//SHOW - shows more info about one campground
router.get("/:id", showCampground);

//Edit campground route
router.get("/:id/edit", checkCampgroundOwnership, errorHandler(getEditCampground));

router.put("/:id", upload.array('images', 2), checkCampgroundOwnership, errorHandler(editCampground));
 
//DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, errorHandler(deletePost));

// Campground Like Route
router.post("/:id/like", isLoggedIn, errorHandler(takeLike));


module.exports = router;