const bcrypt = require("bcrypt");
const mongoose = require("mongoose");


let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim : true,
        required: true,
    },
    password : {
        type: String,
        required: true,
    },
    created: {
        type: Date, 
        default: Date.now,
    },
    role: {
        type: Number,
        required: true,
    } 
});

module.exports = mongoose.model("user", UserSchema);
