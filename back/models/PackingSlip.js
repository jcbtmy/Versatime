const mongoose = require("mongoose");

let item = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
    },
});

let packingSlip = new mongoose.Schema({

    packingSlipNumber: {
        type: Number,
        required: true,
    },
    trackingNumber: {
        type: String,
        trim: true,
    },
    
    orderNumbers: {
        type: [Number],
    },

    RMANumbers: {
        type: [Number],
    },
    boxNumber: {
        type: Number,
    },
    customerPO: {
        type: String,
    },
    shipmentService: {
        type: String,
    },
    items: {
        type: [item],
    },
    returnedItems: {
        type: [item],
    }
});


module.exports = mongoose.model("packingslip", packingSlip);