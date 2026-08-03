const Listitem = require("../models/list.js");
const Review = require("../models/Review.js");

// CREATE review
module.exports.createReview = async (req, res) => {
    let listitem = await Listitem.findById(req.params.id);

    let newreview = new Review(req.body.review);

    // Assign the logged-in user as the review author
    newreview.author = req.user._id;

    listitem.reviews.push(newreview);

    await newreview.save();
    await listitem.save();

    req.flash("success", "Review added!");
    res.redirect(`/listitems/${req.params.id}`);
};

// DELETE review
module.exports.deleteReview = async (req, res) => {
    let { id, reviewid } = req.params;

    await Listitem.findByIdAndUpdate(id, {
        $pull: { reviews: reviewid },
    });

    await Review.findByIdAndDelete(reviewid);

    req.flash("success", "Review deleted!");
    res.redirect(`/listitems/${id}`);
};