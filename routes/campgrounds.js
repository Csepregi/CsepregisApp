const express = require("express");
const router = express.Router();
const {errorHandler, isLoggedIn, checkCampgroundOwnership} = require("../middleware");
const { cloudinary, storage } = require('../cloudinary');
const multer = require('multer');

const upload = multer({ storage });

 
var { getCampgrounds,
      newCampground,
      createCampground,
      editCampground,
      showCampground,
      getEditCampground,
      takeLike,
      deletePost
    } = require('../controllers/campgrounds');



//INDEX - show all campgrounds
router.get("/", errorHandler(getCampgrounds));

//NEW - show form to create new campground
router.get("/new", isLoggedIn, newCampground);

router.post("/", isLoggedIn, upload.array('images', 2),  errorHandler(createCampground))
//SHOW - shows more info about one campground
router.get("/:id", showCampground);

//Edit campground route
router.get("/:id/edit", checkCampgroundOwnership, getEditCampground);

router.put("/:id", upload.array('images', 2), checkCampgroundOwnership, errorHandler(editCampground));
 
//DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, errorHandler(deletePost));

// Campground Like Route
router.post("/:id/like", isLoggedIn, errorHandler(takeLike));


module.exports = router;