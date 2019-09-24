var mongoose = require("mongoose");


var GeolocationSchema = new mongoose.Schema({
    longitude: Number,
    latitude: Number
    // type: {
    //     type: String,
    //     default: "Point"
    // },
    // coordinates: {
    //     type: [Number],
    //     index: "2dsphere"
    // }
});

module.exports = mongoose.model("Geolocation", GeolocationSchema);