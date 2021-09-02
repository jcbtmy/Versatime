const express = require("express");
const auth = require("../middleware/Auth");
const { check, validationResult} = require("express-validator");

const router = express.Router();



const Order = require("../models/Order");
const RMA = require("../models/RMA");
const PackingSlip = require("../models/PackingSlip");
const PackingSlipCounter = require("../models/PackingSlipCounter");
const { update } = require("../models/PackingSlipCounter");


const CreateInputCheck = [
    check("orderNumbers", "please enter a valid order number"),
    check("RMANumbers", "Please provide a valid RMA number"),
    check("items", "Please provide valid items field" ),
    check("packingSlipNumber", "Cannot enter packing slip number").isEmpty(),
    check("boxNumber", "Please provide a valid box number"),
    check("trackingNumber", "Please provide a valid tracking number"),
];

const updateInputCheck = [
    check("orderNumbers", "Please enter a valid order number"),
    check("RMANumbers", "Please provide a valid RMANumber"),
    check("packingSlipNumber", "Cannot update packing slip number").not(),
    check("boxNumber", "Please provide a valid box number"),
    check("trackingNumber", "Please provide a valid tracking number"),
];

router.get("/findOne/:packingSlipNumber", auth, async(req,res) => {

    const packingSlipNumber = req.params.packingSlipNumber;

    if(!packingSlipNumber)
    {
        return res.status(400).json({
            message: "Please provide a valid packing slip number",
        });
    }

    await PackingSlip.findOne({packingSlip: packingSlipNumber})
            .then((slip) => {
                res.status(200).send(slip);
            })
            .catch((error) => {
                res.status(400).json({
                    message: error.message,
                });
            });
            
});

router.get("/findMany/", async(req, res) => {
    
    const {orderNumber, RMANumber} = req.query;

    const query = {};


    if(!orderNumber && !RMANumber)
    {
        return res.status(400).json({
            message: "Please provide an orderNumber or RMANumber",
        });
    }

    if(orderNumber)
    {
        query.orderNumbers = orderNumber;
    }

    if(RMANumber)
    {
        query.RMANumbers = RMANumber;
    }


    await PackingSlip.find(query)
            .then((doc) => {
                res.status(200).send(doc);
            })
            .catch((err) => {
                res.status(400).json({
                    message: err.message,
                })
            });


});


router.post("/create", auth, CreateInputCheck, async(req,res) => {

    const errors =  validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.array()[0].msg,
        });
    }

    const { orderNumbers, 
            RMANumbers, 
            trackingNumber, 
            boxNumber, 
            items, 
            returnedItems,
            customerPO,
            shipmentService,

    } = req.body;

    let packingSlipCounter = await PackingSlipCounter.findById({_id: 'packingSlipCounter'});

    if(!packingSlipCounter){
        return res.status(400).send({
            message: "Could not find packing slip counter",
        });
    }


    packingSlipCounter = packingSlipCounter.seq;

    const packingSlip ={
                        orderNumbers, 
                        RMANumbers,
                        packingSlipNumber: packingSlipCounter,
                        boxNumber,
                        items,
                        trackingNumber,
                        returnedItems,
                        customerPO,
                        shipmentService
    };

    await PackingSlip.create(packingSlip)
        .then(async (doc) => {
            res.status(201).send(doc);
            await PackingSlipCounter.findByIdAndUpdate({_id: 'packingSlipCounter'}, {$inc : {seq : 1}});
        })  
        .catch((err) => {

            res.status(400).json({
                message: err.message,
            });
        });
});

router.post("/createMany", auth, async(req, res) => {

    const packingSlips = req.body.packingSlips;

    if(!Array.isArray(packingSlips) || !packingSlip.length)
    {
        return res.status(400).json({
            message: "Please provide an array of packing slips",
        })
    }

    let packingSlipCounter = await PackingSlipCounter.findById({_id: 'packingSlipCounter'}).catch(err => null);

    if(!packingSlipCounter){
        return res.status(400).json({
            message: "Could not find packing slip counter",
        });
    }


    for(let i = 0; i < packingSlips.length; i++ )
    {
        packingSlips[i].packingSlipNumber = packingSlipCounter.seq;
        packingSlipCounter.seq += 1;
    }

    await PackingSlip.insertMany(packingSlips)
            .then(async(res) => {
                
                await packingSlipCounter.save();
                res.status(200).send(doc);
            })
            .catch((err) => {
                res.status(400).json({
                    message: err.message,
                });
            });
});


router.post("/update/:packingSlipNumber", auth, updateInputCheck, async(req, res) => {

    const errors =  validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.array()[0].msg,
        });
    }

    await PackingSlip.findOneAndUpdate({packingSlipNumber: req.params.packingSlipNumber}, req.body)
                    .then((doc) => {
                        res.status(200).send(doc);
                    })
                    .catch((err) => {
                        res.status(400).json({
                            message: err.message,
                        });
                    });
});


module.exports = router;