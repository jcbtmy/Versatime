const express = require("express");
const auth = require("../middleware/Auth");
const { check, validationResult} = require("express-validator");

const router = express.Router();


const Serial = require("../models/Serial");
const SerialCounter = require("../models/SerialCounter");
const Product = require("../models/Products");
const Customer = require("../models/Customers");
const User = require("../models/User");


const CreateInputCheck = [
    check("_id", "Cannot provide id").not(),
    check("quantity", "Need to provide quantity field").not().isEmpty(),
    check("productId", "Please provide a productId" ).not().isEmpty(),
    check("serialNumber", "Cannot provide serial number").isEmpty(),
    check("customerId", "Please provide customerId").not().isEmpty(),
];

const HistoryCheck = [
    check("action", "Please provide a valid action").not().isEmpty(),
    check("orderNumber", "Please provide a orderNumber").not().isEmpty(),
    check("RMANumber", "Please provide an RMANumber").not().isEmpty(), 
    check("note", "Please enter a valid note").not().isEmpty(),
]

const updateCheck = [
    check("serialNumber", "Not allowed to update serialNumber").isEmpty(),
]


router.post("/insert", async(req,res) => {
    await Serial.create(req.body)
            .then((doc) => {
                res.status(200).send(doc);
            })
            .catch((error) => {
                console.log(req.body);
                console.log(error.message);
                res.status(422).json({
                    message: error.message,
                });
            })
})


router.post("/create", CreateInputCheck ,async(req,res) => {

    const errors =  validationResult(req);
    const newSerials = [];

    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.array()[0].msg,
        });
    }
    
    const product = await Product.findOne({productId: req.body.productId});

    if(!product || !product.serialRequired){
        return res.status(400).json({
            message: "Could not find product",
        }); 
    }

    const customer = await Customer.findById(req.body.customerId);

    if(!customer){
        return res.status(400).json({
            message: "Could not find customer",
        });
    }

    let serialNumber = await SerialCounter.findById({_id: 'serialCounterId'});

    if(!serialNumber){
        return res.status(400).json({
            message: "Could not find serail counter",
        });
    }

    const user = await User.findById(req.session.userID)

    if(!user){
        return res.status(400).json({
            message: "Could not find user",
        });
    }

    let serialIter = serialNumber.seq;

    for(let i = 0; i < req.body.quantity; i++){

            const newSerialReq = {
                serialNumber: serialIter,
                customerId: req.body.customerId,
                productId: req.body.productId,
                history:[{
                    action: "Created",
                    date: new Date(),
                    author: user.username,
                    orderNumber: (req.body.orderNumber) ? req.body.orderNumber : null,
                    RMANumber: (req.body.RMANumber) ? req.body.RMANumber : null,
                    note: "",
                }],
            };

            newSerials.push(newSerialReq);
            serialIter += 1;
    }

    const success = await Serial.insertMany(newSerials)
        .then((doc) => res.status(200).send(doc))
        .catch((err) => {
            res.status(400).json({
                message: err.message,
            }); 
            return null
        });
    
    if(success) 
    {
        await SerialCounter.findByIdAndUpdate({_id: 'serialCounterId'}, {$inc : {seq : req.body.quantity}});
    } 
    

});


router.get("/recent/:amount", async(req, res) => {

    const amount = parseInt(req.params.amount);

    if(amount >= 15 && amount < 1)
    {
        return res.status(400).json({
            msg: "Invalid armount size",
        });
    }

    let serials = await Serial.find({}).sort({ _id: -1 }).limit(amount).catch(err => null);

    if(!serials){
        return res.status(400).json({
            message: "Error finding recent serials",
        });
    }

    res.send(serials);

});



router.put("/addHistory/:serialNumber", async(req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.array()[0].msg,
        });
    }

    const {action, note, orderNumber, RMANumber, passed} = req.body;

    const serial = await Serial.findOne({serialNumber: req.params.serialNumber}).catch(err => null);
    const user = await User.findOne({_id: req.session.userID}).catch(err => null);


    if(!serial)
    {
        return res.status(400).json({
            message: "Serial does not exist",
        });
    }

    if(!user)
    {
        return res.status(400).json({
            message: "User does not exist",
        });
    }

    serial.history.push({   action: action, 
                            date: new Date(), 
                            author: user.username, 
                            orderNumber: orderNumber,
                            RMANumber: RMANumber,
                            passed: passed,
                            note: note,
                        });


    await serial.save(function(err, doc){
        if(err)
        {
            res.status(400).json({
                message: "Error Saving History"
            });
        }
        else{          
            res.send(doc);
        }
    });

    

});


router.post("/update/:_id", updateCheck, async(req, res) => {

    const errors =  validationResult(req);

    
    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.array()[0].msg,
        });
    }

    await Serial.updateOne(req.params, req.body, function(err, doc){
        if(err)
        {
            res.status(400).json({
                message: err.message,
            });
        }
        else{
            res.status(200).send(doc);
        }
    });

});

router.get("/:serialNumber", async(req,res) => {

  await Serial.findOne(req.params)
            .then((doc) => {
                res.status(200).send(doc);
            })
            .catch((err) => {
                res.status(400).json({
                    message: err.message,
                })
            }); 

   
});



router.get("/", async(req, res) => {

    const serialsFormat = [];
    const serials = await Serial.find({}, 'serialNumber customerId');

    if(!serials){
        return res.status(400).json({
            message: "Could not find serials",
        })
    }

    for(let i  = 0; i < serials.length; i++)
    {
        const jsonSerial = serials[i].toJSON();
        const customer = await Customer.findById(jsonSerial.customerId);
        if(customer){
            serialsFormat.push({serialNumber: jsonSerial.serialNumber, customer: customer.toJSON()});
        }
    }

    res.send(JSON.stringify(serialsFormat));
}); 


module.exports = router;