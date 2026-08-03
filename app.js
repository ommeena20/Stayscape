const express = require("express");
const app = express();
if(process.env.NODE_ENV!="production"){
  require("dotenv").config()

}
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("CLOUD_KEY:", process.env.CLOUD_KEY);
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET);

const Listitem = require("./models/list.js");
const Review = require("./models/Review.js");

const Wrapasync = require("./utility/Wrapasync.js");
const ExpressError = require("./utility/ExpressError.js");
const { Listitemschema, reviewschema } = require("./schema.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");

const Localstrategy=require("passport-local");
const Client=require("./models/Client.js")


const soptions={
   secret:process.env.SESSION_SEC,
    resave: false,
    saveUninitialized: true,
    cookie:{
     httpOnly: true,
     secure: false,
      expires: Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000
      
    }
}




const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const reviews=require("./routes/reviews.js");
const ClientRouter=require("./routes/Client.js");


const listitems=require("./routes/list.js");

const mongoose = require("mongoose");

// ---------------- MIDDLEWARE ----------------
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.engine("ejs", ejsmate);
app.set("views", path.join(__dirname, "/views"));

// ---------------- DB ----------------
main()
  .then(() => console.log("everything is fine"))
  .catch((err) => console.log(err));
  console.log("Connecting to:", process.env.MONGO_URI ? "ATLAS" : "LOCAL FALLBACK");

async function main() {
  const dbUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Mern";
  await mongoose.connect(dbUrl);
}
app.use(session(soptions))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(Client.authenticate()));


passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());

app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.CurrUser=req.user;
  next();

})

app.use('/listitems',listitems);
app.use("/listitems/:id/reviews",reviews);
app.use("/",ClientRouter);

app.get("/about", (req, res) => {
  res.render("listitems/About.ejs");
});

app.get("/", (req, res) => {
  res.redirect("/listitems");
});

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 501, message = "Something went wrong" } = err;

  res.status(statusCode).render("listitems/error.ejs", {
    err,
    message,
  });
});

const port = process.env.PORT || 9876;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});