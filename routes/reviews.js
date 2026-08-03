const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedin, isAuthor } = require("../middleware.js");
const Wrapasync = require("../utility/Wrapasync.js");
const ExpressError = require("../utility/ExpressError.js");
const { reviewschema } = require("../schema.js");
const Reviewcontroller = require("../controllers/Review.js");

// ---------------- VALIDATION ----------------

const validatereview = (req, res, next) => {
  let { error } = reviewschema.validate(req.body);

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errmsg);
  }

  next();
};

// ---------------- ROUTES ----------------

router
  .route("/")
  .post(
    isLoggedin,
    validatereview,
    Wrapasync(Reviewcontroller.createReview)
  );

router
  .route("/:reviewid")
  .delete(
    isLoggedin,
    isAuthor,
    Wrapasync(Reviewcontroller.deleteReview)
  );

module.exports = router;