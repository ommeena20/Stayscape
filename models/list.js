const mongoose = require("mongoose");
const { Schema } = mongoose;

const listSchema = new Schema({
    title: String,
    description: String,
    image: {
        url: String,
        filename:String
        
    },
    price: Number,
    location: String,
    country: String,

    
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner:{
        type: Schema.Types.ObjectId,
        ref: "Client",

      }  

});
const Review = require("./Review");
const { string } = require("joi");

listSchema.post("findOneAndDelete", async (list) => {
    if (list) {
        await Review.deleteMany({
            _id: { $in: list.reviews }
        });
    }
});

const Listitem = mongoose.model("Listitem", listSchema);

module.exports = Listitem;