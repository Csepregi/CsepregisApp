const Campground = require('../models/campground');

module.exports = {
    async getCampgrounds(req, res, next){
        let campgrounds = await Campground.find({});
        res.render("campgrounds/index", {campgrounds, currentUser: req.user, page: 'campgrounds'})
    }
}