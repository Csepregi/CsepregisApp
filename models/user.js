var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String
});

UserSchema.plugin(passportLocalMongoose);  // add all passport local mongoose functions to userschema

module.exports = mongoose.model("User", UserSchema);