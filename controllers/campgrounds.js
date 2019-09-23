require('dotenv').config();
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const fetch = require('node-fetch');
//const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${campground.location},uk&units=metric&appid=${process.env.WeatherToken}`

const { cloudinary } = require('../cloudinary');

module.exports = {
    async getCampgrounds(req, res, next){
        let campgrounds = await Campground.find({});
        res.render("campgrounds/index", {campgrounds, currentUser: req.user, page: 'campgrounds'})
    }, 

     getFamilyMap(req, res, next){
      console.log("ciao");
      res.render("mapFamily")
    },

    async newCampground (req, res, next)  {
          console.log("ciao");
           res.render("campgrounds/new")
    },

    async createCampground(req, res, next){
        req.body.campground.images = [];
        for(const file of req.files){
            req.body.campground.images.push({
              url: file.secure_url,
              public_id: file.public_id
            });
            req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
            }
        
          }
          let response = await geocodingClient
        .forwardGeocode({
          query: req.body.campground.location,
          limit: 1
        })
        .send();
        req.body.campground.coordinates = response.body.features[0].geometry.coordinates;
          
        let campground = await Campground.create(req.body.campground)
        res.redirect('/campgrounds/' + campground.id);
        }, 

        async showCampground(req, res, next){
         //find the campground with provided id
            Campground.findById(req.params.id).populate("comments likes").exec(async (err, foundCampground) => {
                if(err){
                    console.log(err)
                } else {
                    console.log(foundCampground);
                    console.log("hello");
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${foundCampground.location},uk&units=metric&appid=${process.env.WeatherToken}`)
                    const json = await response.json();
            
                    const weather = {
                      icon: json.weather[0].icon,
                      temp: json.main.temp
                    }
                    //render show template that campground
                    res.render("campgrounds/show", {campground: foundCampground, weather: weather});
                }
            })
        },

        async getEditCampground(req, res, next){
            let campground = await Campground.findById(req.params.id);
                         res.render("campgrounds/edit", {campground});
        },

        async editCampground(req, res, next){
            let campground = await Campground.findById(req.params.id);
            //check if there is any image for deletion
            if(req.body.deleteImages && req.body.deleteImages.length){
              // assign deleteImages from req.body to its own constiable
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
            for(const file of req.files){              // add images to post.images array
              campground.images.push({
                url: file.secure_url,
                public_id: file.public_id
              });
            }
          }
          // check if location was updated
          if(req.body.campground.location !== campground.location) {
            let response = await geocodingClient
              .forwardGeocode({
                query: req.body.campground.location,
                limit: 1
              })
              .send();
            campground.coordinates = response.body.features[0].geometry.coordinates;
            campground.location = req.body.campground.location;
          }
          campground.name = req.body.campground.name;
          campground.description = req.body.campground.description;
      
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
          },

          async takeLike(req, res, next){
            try {
              let foundCampground = await Campground.findById(req.params.id);  
              // check if req.user._id exists in foundCampground.likes
                const foundUserLike = foundCampground.likes.some((like) => {
                    return like.equals(req.user._id);
                });
        
                if (foundUserLike) {
                    // user already liked, removing like
                    foundCampground.likes.pull(req.user._id);
                } else {
                    // adding the new user like
                    foundCampground.likes.push(req.user);
                }
        
                foundCampground.save((err) => {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    return res.redirect("/campgrounds/" + foundCampground._id);
                });
            } catch(error){
                console.log(error)
            }
        },

        async deletePost(req, res, next){
          Campground.findById(req.params.id, async (err, campground) => {
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            } try {
              for(const image of campground.images){
                await cloudinary.v2.uploader.destroy(image.public_id);           
              }
             await campground.remove();
                req.flash('success', 'Campground deleted successfully')
                res.redirect('/campgrounds');
            } catch (error) {
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
          })
        }
      }
    