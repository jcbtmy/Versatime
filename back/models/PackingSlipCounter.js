
const mongoose = require("mongoose");


let PackingSlipCounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 0},
});


module.exports = mongoose.model('packingSlipCounter', PackingSlipCounterSchema);