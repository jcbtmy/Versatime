const express = require("express");
const auth = require("../middleware/Auth");
const { check, validationResult} = require("express-validator");
const Customer = require("../models/Customers");
const Serial = require("../models/Serial");


const router = express.Router();

const inputCheck = [
    check("customerName", "Please enter a valid customer name")
    .notEmpty(),
]

router.get("/", async(req, res)=>{
    const customers = await Customer.find({}, "_id customerName");

    if(!customers){
        return res.status(500).json({
            msg: "Internal server error"
        });
    }

    res.send(customers);
});

router.post("/create", inputCheck, async(req, res) => {

    const err = validationResult(req);

    if(!err.isEmpty()){
        return res.status(400).json({
            msg: err.array(),
        });
    }

    const {customerName} = req.body;

    const isDuplicate = await Customer.findOne({customerName});

    if(isDuplicate){
        return res.status(400).json({
            msg: "Customer already exists",
        });
    }

    const newCustomer = new Customer({customerName});
    let id;

    await newCustomer.save((err, entry) => {
        id = entry._id;
    });

    return res.status(200).json({id, customerName});

});


router.delete("/:customerId", auth, async(req,res) => {

    if(!req.session.userID)
    {
        return res.status(400).json({
            message: "No Session",
        })
    }

    const user = await User.findOne({_id: req.session.userID}, {});


    if(user.role)
    {
        return res.status(400).json({
            message: "Only admin allowed to delete user",
        });
    }
    
    const serials = await Serial.find({customerId: req.params.customerId}).catch(err => null);

    if(!serials)
    {
        return res.status(400).json({
            message: "Error searching for serials",
        });
    }

    if( serials && serials.length)
    {
        return res.status(400).json({
            message: "Must have no serial numbers associated in order to delete customer",
        });
    }


    await Customer.deleteOne({_id: req.params.customerId})
            .then((doc) => res.status(200).json({
                message: "sucessfully deleted",
            }))
            .catch((err) => {
                res.status(400).json({
                    message: err.message,
                });
            });

});







module.exports = router;