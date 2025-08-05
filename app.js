require('dotenv').config();

const express= require("express");
const app= express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport= require("passport");
const localStrategy= require("passport-local");
const User= require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl= process.env.ATLASDB_URL;
const PORT= 8080;

async function main() {
  await mongoose.connect(dbUrl, {
    tls: true,                     // Enable TLS/SSL
    tlsAllowInvalidCertificates: true,  // Change to true only for testing if SSL errors persist
  });
}

main().then(() =>{
    console.log("Connected to DB");
}).catch((err) =>{
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//session store
const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error", function(e){
  console.log("Session store error", e);
});
//common and by default values of session
const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie:{
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

//passport js 
app.use(passport.initialize()); //initalize library
app.use(passport.session()); //dont have to login again & again
passport.use(new localStrategy(User.authenticate()));   //static method of modeling
passport.serializeUser(User.serializeUser()); //to store user in session
passport.deserializeUser(User.deserializeUser()); //to get user from session


//flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success") || [];
    res.locals.error = req.flash("error") || [];
    res.locals.currUser = req.user; //to access current user in all views
    next(); 
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode=500, message="Something went wrong"} = err;
  res.status(statusCode).render("error.ejs", {message});
});

app.listen(PORT, () =>{
    console.log("Server is listening");
});