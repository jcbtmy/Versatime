const mongoose = require("mongoose");



let CustomerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("customer", CustomerSchema);