const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    author:{
      type:Schema.Types.ObjectId,
      ref:"Client"

    }
});

module.exports = mongoose.model("Review", reviewSchema);
