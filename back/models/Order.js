const mongoose = require("mongoose");


let OrderItem = new mongoose.Schema({
    productId: {
        type: String,
        required: true,   
    },
    quantity: {
        type: Number,
        required: true
    },
    serials: {
        type: [Number],
    }
});


let OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        trim : true,
        required: true,
    },
    customerId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    to : {
        type: String,
    },
    shipTo: {
        type: String,
    },
    orderDate: {
        type: Date, 
        default: Date.now,
    },
    items : {
        type: [OrderItem]
    },

});

module.exports = mongoose.model("order", OrderSchema);
