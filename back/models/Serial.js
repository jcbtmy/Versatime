
const mongoose = require("mongoose");


let Action = new mongoose.Schema({
    action: {
       type: String,
       required: true, 
       enum: ["Tested", "Shipped", "RMA", "Created", "Note" ],
    },
    passed: {
        type: Boolean,
    },
    author: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    orderNumber : {
        type: Number,
    },
    RMANumber: {
        type: Number,
    },
    date: {
        type: Date,
    }
    
});

let SerialSchema = new mongoose.Schema({
    serialNumber: {
        type: Number,
        required: true,
    },
    productId : {
        type: String,
        required: true,
    },
    customerId: {
        type: String
    },
    mesh:{
        type: String,
        trim: true,
    },
    bluetooth:{
        type: String,
        trim: true,
    },
    warrantyExprDate: {  
        type: Date,
    },
    note:{
        type: String,
    },
    version:{
        type: String,
    },
    history: {
        type: [Action],
    }
});


module.exports = mongoose.model("serial", SerialSchema);
