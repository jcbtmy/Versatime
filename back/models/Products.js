const mongoose = require("mongoose");


let ProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        trim : true,
        required: true,
    },
    productName : {
        type: String,
        required: true,
    },
    serialRequired: {
        type: Boolean,
    },
    productPackage: {
        type: [String],
    }
});

module.exports = mongoose.model("product", ProductSchema);
