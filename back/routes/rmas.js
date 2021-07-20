const express = require("express");
const auth = require("../middleware/Auth");
const { check, validationResult} = require("express-validator");
const RMA = require("../models/RMA");
const Customer = require("../models/Customers");
const User = require("../models/User");
const Serial = require("../models/Serial");



const router = express.Router();

const CreateInputCheck = [
    check("RMANumber", "Please provide a RMA Number").not().isEmpty(),
    check("customerId", "Please provide a customerId" ).not().isEmpty(),
    check("RMADate", "Please provide and RMA Date").not().isEmpty(),
];

const updateTestCheck = [
    check("itemId", "Please provide a rma item id").not().isEmpty(),
    check("tests", "Please provide tests").not().isEmpty(),
];

router.get("/:RMANumber", async(req, res) => {

    await RMA.findOne(req.params)
            .then((rma) => {
                res.status(200).send(rma);
            })
            .catch((error) => {
                res.status(400).json({
                    message: error.message,
                });
            });
})

router.get("/", async(req, res) => {

    let rmas = await RMA.find({}, 'RMANumber customerId');
    const rmasFormat = [];

    if(!rmas)
    {
        return res.status(400).json({
            message: "Error getting serials",
        });
    }

    for(let i = 0; i < rmas.length; i++)
    {
        const rma = rmas[i].toJSON();
        const customer = await Customer.findById(rma.customerId);
        if(customer)
        {
            rmasFormat.push({customer: customer.toJSON(), RMANumber: rma.RMANumber});
        }
    }

    res.send(rmasFormat);

});


router.put("/updateDetails/:RMANumber" , async(req, res) => {

   await RMA.findOneAndUpdate(req.params, req.body)
            .then((rma) => {
                res.status(200).send(rma);
            })
            .catch((error) => {
                res.status(400).json({
                    message: error.message,
                });
            });
});

router.put("/updateTests/:RMANumber", async(req, res) => {

    await RMA.findOneAndUpdate({RMANumber: req.params.RMANumber, 'items._id': req.body.itemId},
            {
                "$set": {
                    "items.$.tests": req.body.tests,
                }
            })
            .then((rma) => {
                res.status(200).send(rma);
            })
            .catch((error) => {
                res.status(400).json({
                    message: error.message,
                })
            })

});

router.get("/recent/:amount", async(req,res) => {

    const amount = parseInt(req.params.amount);

    if(amount >= 15 && amount < 1)
    {
        return res.status(400).json({
            message: "Invalid armount size",
        });
    }

    await RMA.find({}).sort({ _id: -1 }).limit(amount)
            .then((rmas) => {
                res.status(200).send(rmas);
            })
            .catch((error) => {
                res.status(400).json({
                    message: error.message,
                });
            })

});


router.post("/create", async(req,res) => {

    const err = validationResult(req);

    if(!err.isEmpty())
    {
        return res.status(400).json({
            message: errors.array()[0].msg,
        });
    }

    const customer = await Customer.findById(req.body.customerId).catch(err => null); //check if customer exists

    if(!customer)
    {
        return res.status(400).json({
            message: "Could not find customer",
        });
    }

    const user = await User.findById(req.session.userID) //check if user exists

    if(!user){
        return res.status(400).json({
            message: "Could not find user",
        });
    }

    const isDuplicate = await RMA.findOne({RMANumber: req.body.RMANumber}); //is it a duplicate
    
    if(isDuplicate)
    {
        return res.status(400).json({
            message: "RMANumber already exists",
        })
    }

    if(req.body.items)
    {
        for(let i = 0; i < req.body.items.length; i++){

            const item = req.body.items[i];

            if(item.serialNumber) //if its a serial number update the serial history
            {
                const serial = await Serial.findOne({serialNumber: item.serialNumber}).catch(err => null);
                
                if(serial)
                {
                    serial.history.push({
                        action: "RMA", 
                        author: user.username,
                        note: "",
                        date: new Date(),
                        RMANumber: req.body.RMANumber,
                        OrderNumber: null,
                    });

                    const success = await serial.save().catch(err => console.log(err));
                }
            }

            req.body.items[i] = item;
        }
    }

    const rma = new RMA(req.body);

    await rma.save()
            .then((doc) => {
                res.status(201).send(doc);
            })
            .catch((error) => {
                res.status(400).json({
                    message: error.message,
                });
            })
});






module.exports = router;