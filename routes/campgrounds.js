var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
// var NodeGeocoder = require('node-geocoder');
var request = require("request");
var multer = require('multer');
var upload = multer({ 'dest': 'uploads/', fileFilter: imageFilter});
 
var { getCampgrounds,
      newCampground,
      createCampground,
      editCampground,
      showCampground,
      getEditCampground
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
router.get("/", middleware.errorHandler(getCampgrounds));

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, newCampground);

router.post("/",upload.array('images', 2), middleware.errorHandler(createCampground) ,middleware.isLoggedIn)
//SHOW - shows more info about one campground
router.get("/:id", showCampground);

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, middleware.errorHandler(getEditCampground));

router.put("/:id", upload.array('images', 2), middleware.errorHandler(editCampground), middleware.checkCampgroundOwnership);
 
//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, async (err, campground) => {
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        } try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            campground.remove();
            req.flash('success', 'Campground deleted successfully')
            res.redirect('/campgrounds');
        } catch (error) {
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }
        }
    })
})


module.exports = router;