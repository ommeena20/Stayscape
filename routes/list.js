
const express = require("express");
const router = express.Router({ mergeParams: true });

const Listcontroller = require("../controllers/List.js");

const Wrapasync = require("../utility/Wrapasync.js");
const ExpressError = require("../utility/ExpressError.js");
const { isLoggedin, isOwner } = require("../middleware.js");
const { storage } = require("../Cloudconfig.js");
const { Listitemschema } = require("../schema.js");

const multer = require("multer");
const upload = multer({ storage });

// ---------------- VALIDATION ----------------

const validatelisitem = (req, res, next) => {
  let { error } = Listitemschema.validate(req.body);

  if (error) {
    throw new ExpressError(402, "List item validation failed");
  }

  next();
};

// ---------------- INDEX & CREATE ----------------

router
  .route("/")
  .get(Wrapasync(Listcontroller.index))
  .post(
    isLoggedin,
    upload.single("image"),
    validatelisitem,
    Wrapasync(Listcontroller.createForm)
  );

   router
  .route("/gallery")
  .get(Wrapasync(Listcontroller.gallery));



// ---------------- WISHLIST ----------------

router
  .route("/wishlist")
  .get(
    isLoggedin,
    Wrapasync(Listcontroller.Showlist)
  );

router
  .route("/wishlist/:id")
  .post(
    isLoggedin,
    Wrapasync(Listcontroller.addwishlist)
  )
  .delete(
    isLoggedin,
    Wrapasync(Listcontroller.Deletewishlist)
  )

// ---------------- NEW LISTING FORM ----------------

router
  .route("/create")
  .get(
    isLoggedin,
    Listcontroller.renderForm
  );

// ---------------- SEARCH ----------------

router
  .route("/search")
  .get(
    Wrapasync(Listcontroller.Search)
  );

// ---------------- SHOW / UPDATE / DELETE ----------------

router
  .route("/:id")
  .get(
    isLoggedin,
    Wrapasync(Listcontroller.showsingleitem)
  )
  .put(
    isLoggedin,
    isOwner,
    upload.single("image"),
    validatelisitem,
    Wrapasync(Listcontroller.updatelist)
  )
  .delete(
    isLoggedin,
    Wrapasync(Listcontroller.deletelist)
  );



router
  .route("/:id/edit")
  .get(
    isLoggedin,
    isOwner,
    Wrapasync(Listcontroller.editForm)
  );

 

module.exports = router;