const { ObjectId } = require("bson");
const mongoose = require("mongoose");

let test = new mongoose.Schema({
    part: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    passed: {
        type: Boolean,
    }
}); 

let item = new mongoose.Schema({
    serialNumber : {
        type: Number,
    },
    productId: {
        type: String,
    },
    issue: {
        type: String,
    },
    tests: {
        type: [test],
    },
    underWarranty: {
        type: Boolean,
    }
});


let RMASchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    RMANumber: {
        type: Number,
        required: true,
    },

    RMADate : {
        type: Date,
    },

    to: {
        type: String,
    },

    shipTo: {
        type: String,
    },

    dateReceived: {
        type: Date,
    },

    additionalNotes : {
        type: String,
    },

    items : {
        type:[item],
    }

});



module.exports =  mongoose.model("rma", RMASchema);