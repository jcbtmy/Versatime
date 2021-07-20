
const mongoose = require("mongoose");


let SerialCounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 0},
});


module.exports = mongoose.model('serialCounter', SerialCounterSchema);