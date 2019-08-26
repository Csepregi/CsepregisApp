require('dotenv').config();
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"), 
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");


//var url = process.env.DATABASEURL || "mongodb://localhost: 27017/yelp_camp_v5, { useNewUrlParser: true }"
//mongoose.connect(url);

//mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

//mongoose.connect("mongodb://localhost: 27017/yelp_camp", {useNewUrlParser: true});

mongoose.connect("mongodb+srv://gabor:hangfive2019@yelpcamp-f3q6z.mongodb.net/test", {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to DB!');
}).catch(err => {
    console.log('ERROR:', err.message);
});


//mongodb://gabor:Hangfive2019@ds026658.mlab.com:26658/yelpcamp
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //dirname refers to the directory that the script is running
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database //we export the function

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Pálinka is the best dog", 
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){   //we pass every route the current user, and pass the next code (next())
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");//if there is anything in the template it will exit in the message template ,variable
    res.locals.success = req.flash("success");
    next();
})

// SCHEMA SETUP



app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;


app.listen(port, function() {
    console.log("The YelpCamp Server has started");
});