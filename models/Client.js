const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default;

let clientschema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
     wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listitem"
        }
    ]
});

clientschema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("Client", clientschema);