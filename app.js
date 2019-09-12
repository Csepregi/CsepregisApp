require('dotenv').config();
const express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"), 
    mongodb         = require("mongodb").MongoClient,
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride = require("method-override"),
    User            = require("./models/user"),
    session         = require('express-session'),
    seedDB          = require("./seeds");

//requiring routes
const commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");


//mongoose.Promise = global.Promise;

//const url = process.env.DATABASEURL || "mongodb://localhost: 27017/yelp_camp, { useNewUrlParser: true, useCreateIndex: true }"
//url
//mongoose.connect(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true , useCreateIndex: true });



// mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true } )
//       .then(() => console.log(`Database connected`))
//       .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //dirname refers to the directory that the script is running
app.use(express.static('/public'));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database //we export the function

//PASSPORT CONFIGURATION
app.use(session({
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
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};
    // res.status(err.status || 500);
    // res.render('error');
    res.locals.currentUser = req.user;
    //
    res.locals.success = req.session.success || '';
    delete req.session.success;
    //
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