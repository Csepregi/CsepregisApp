const Campground = require('../models/campground');
var cloudinary = require('cloudinary');
var NodeGeocoder = require('node-geocoder');
 var request = require("request");
 

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

module.exports = {
    async getCampgrounds(req, res, next){
        let campgrounds = await Campground.find({});
        res.render("campgrounds/index", {campgrounds, currentUser: req.user, page: 'campgrounds'})
    }, 

    async createCampground(req, res, next){
        req.body.campground.images = [];
        for(const file of req.files){
            const image = await cloudinary.v2.uploader.upload(file.path)
            req.body.campground.images.push({
            url: image.secure_url,
            public_id: image.public_id
            });
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
        })
        
        }
        let campground = await Campground.create(req.body.campground)
        res.redirect('/campgrounds/' + campground.id);
        }, 
        async editCampground(req, res, next){
            let campground = await Campground.findById(req.params.id);
            //check if there is any image for deletion
            if(req.body.deleteImages && req.body.deleteImages.length){
              // assign deleteImages from req.body to its own variable
              for(const public_id of req.body.deleteImages){
                //delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                //delete image from post.images
                for(const image of campground.images){
                  if(image.public_id === public_id){
                    let index = campground.images.indexOf(image);
                    campground.images.splice(index, 1);
                  }
                }
              }
            }
            //check if there are any new images for upload
            if(req.files){
            for(const file of req.files){
              const image = await cloudinary.v2.uploader.upload(file.path)
              // add images to post.images array
              campground.image.push({
                url: image.secure_url,
                public_id: image.public_id
              });
            }
          }
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
          }
        }
    