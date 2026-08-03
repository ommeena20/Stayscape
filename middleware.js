const Listitem = require("./models/list.js");
const Review = require("./models/Review.js");
const rateLimit = require("express-rate-limit");
module.exports.isLoggedin=(req,res,next)=>{


        console.log("User:", req.user);
     if(!req.isAuthenticated()){
        req.session.redirect=req.originalUrl;
     req.flash("error", "please login and then create");
     return res.redirect("/login");
   }
   next();
}
module.exports.redirectsave = (req, res, next) => {
    if (req.session.redirect) {
        res.locals.redirect = req.session.redirect;
    }
    next();
};


module.exports.isOwner = async(req, res, next) => {


       const { id } = req.params;
    
        let item = await Listitem.findById(id);
    
       if(! item.owner.equals(res.locals.CurrUser._id)){
          req.flash("error", "You are not allowed to edit this item.");
           return  res.redirect(`/listitems/${id}`);
        }

    next();
};



module.exports.isAuthor = async(req, res, next) => {


       const {id, reviewid } = req.params;
         let review = await Review.findById(reviewid);

        if(! review.author.equals(res.locals.CurrUser._id)){
          req.flash("error", "You are not the author of this item.");
           return  res.redirect(`/listitems/${id}`);
        }

    next();
};

module.exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: "Too many login attempts. Please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});