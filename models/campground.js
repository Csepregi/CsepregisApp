var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    images: [{url: String, public_id: String}],
    description: String, 
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

module.exports = mongoose.model("Campground", campgroundSchema);
