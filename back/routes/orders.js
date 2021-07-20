
const express = require("express");
const auth = require("../middleware/Auth");
const { check, validationResult} = require("express-validator");
const Order = require("../models/Order");
const Customer = require("../models/Customers");
const Product = require("../models/Products");
const Serial = require("../models/Serial");
const SerialCounter = require("../models/SerialCounter");
const User = require("../models/User");
const { route } = require("./serials");


const router = express.Router();


const inputCheck = [
    check("orderNumber", "Please enter a valid Product Id")
        .not()
        .isEmpty(),
    check("customerId", "Please enter a valid Customer Id")
        .not()
        .isEmpty(),
    check("items", "Pleas enter items")
        .not()
        .isEmpty(),
    check("orderDate", "Please enter a valid Order Date")
        .not()
        .isEmpty(),
    check("to", "Please enter a valid to address")
        .not()
        .isEmpty(),
    check("shipTo", "Please enter a valid shipTo field")
        .not()
        .isEmpty(),
    
];

const detailsCheck = [
    check("orderNumber", "Cannot Update Order Number").isEmpty(),
    check("items", "Cannot Update items").isEmpty(),
];

const itemCheck = [
    check("productId", "Please enter valid productId").not().isEmpty(),
    check("quantity", "Please enter valid quantity").not().isEmpty(),
    check("serials", "please enter serials").not().isEmpty(),
];

const testSerialCheck = [
    check("serials", "Please provide valid serials").not().isEmpty(),
];


router.get("/", async(req, res) => {

    let allOrders = [];
    let orders = await Order.find({}, "orderNumber customerId");

    if(!orders)
    {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
    
    for(let i  = 0; i < orders.length; i++)
    {
        const jsonOrder = orders[i].toJSON(); //format order to editable object

        const customer = await Customer.findById(jsonOrder.customerId); //get the customer on server side because O(1) for id

        if(customer){

            allOrders.push({orderNumber: jsonOrder.orderNumber, customer: customer.toJSON()});

        }
    }

    res.send(JSON.stringify(allOrders));
}
);

router.get("/recent/:amount", async(req,res) => {

    const amount = parseInt(req.params.amount);

    if(amount >= 15 && amount < 1)
    {
        return res.status(400).json({
            message: "Invalid amount size",
        });
    }

    await Order.find({}).sort({ _id: -1 }).limit(amount)
            .then((doc) => {
                res.status(200).send(doc);
            })
            .catch((error) => {
                res.status(400).json({
                    message:  error.message,
                });
            });

});

router.get("/:orderNumber", async(req, res) => {

   await Order.findOne(req.params)
            .then((order) => {
                res.status(200).send(order);
            })
            .catch((error) => {
                res.status(400).json({
                    message: error.message,
                });
            });

});




router.put("/updateDetails/:orderNumber", detailsCheck, async(req, res) => {

    await Order.findOneAndUpdate(req.params, req.body)
            .then((order) => {
                res.status(200).send(order);
            })
            .catch((error) => {
                res.status(422).json({
                    message: error.message,
                })
            });
});


router.put("/updateItems/:orderNumber", itemCheck, async(req, res) => {

    let order = await Order.findOne(req.params);
    let product = await Product.findOne(req.body.productId);

    if(!order){
        return res.status(400).json({
            msg: "Order does not exist",
        });
    }

    if(!product)
    {
        return res.status(400).json({
            msg: "Product does not exist",
        });
    }

    order.items.push(req.body);

    await order.save(function(err, doc){
        if(err){
            res.status(400).json({
                    message: "Error Saving Order"
            });
        }
        else{
            res.status(201).send(doc);
        }
    });

});

router.post("/createSerials/:orderNumber", async(req,res) =>  {
    
    const order = await Order.findOne(req.params).catch(err => null); //find the order

    if(!order){
        return res.status(400).json({
            message: "Could not find order",
        })
    }

    const user = await User.findById(req.session.userID).catch(err => null) //find user creating serials

    if(!user){
        return res.status(400).json({
            message: "Could not find user",
        });
    }

    const orderItems = order.items; //get items from order
    const serialCounter = await SerialCounter.findById({_id: 'serialCounterId'}).catch(err => null); //get the last serial made

    if(!serialCounter){
        return res.status(400).json({
            message: "Could not find serial counter",
        });
    }

    let serialIter = serialCounter.seq;

    for(let i = 0; i < order.items.length; i++){

        const item = order.items[i];

        const product = await Product.findOne({productId: item.productId}).catch(err => null); //find product

        const newSerials = [];

        
        //check if product is valid, if a serial is required for product, and if any have been made yet
        if(product && product.serialRequired && !item.serials.length) 
        {  
            for(let j = 0; j < item.quantity; j++){

                const newSerialReq = {
                    serialNumber: serialIter,
                    customerId: order.customerId,
                    productId: product.productId,
                    history:[{                     //add created, date, orderNumber, and who created for serial history
                        action: "Created",
                        date: new Date(),
                        author: user.username,
                        orderNumber: order.orderNumber,
                        RMANumber: null,
                        note: "",
                    }]
                };
                
                newSerials.push(newSerialReq); //update insertmany list

                order.items[i].serials.push(serialIter); //update order product serials

                serialIter += 1;
            }

            const insertSerials = await Serial.insertMany(newSerials).catch((err) => {
                res.status(500).json({
                    message: err.message,
                });
            });

            if(insertSerials) //if the insert was successfull update the last serial number created
            {

                await SerialCounter.findByIdAndUpdate({_id: 'serialCounterId'}, {$inc : {seq : item.quantity}}); 

                await order.save()
                      .then((order) => {
                          res.status(201).send(order);
                      })
                      .catch((error) => {
                          res.status(422).json({
                              message: error.message,
                          })
                      });
            }
        }   
    }

});

router.get("/testedSerials/:orderNumber", async(req,res) => {

    const serialTests = {}; //obj[serialNumber] => test result
    const order = await Order.findOne(req.params).catch(err => null); //find order

    if(!order)
    {
        return res.status(400).json({
            message : "Could not find order",
        });
    }
    
    const items = order.items;

    //go through every item in the order and check if their serials have been tested
    for(let i = 0; i < items.length; i++){

        const serials = items[i].serials;

        for(let j = 0; j < serials.length; j++) 
        {
            const serial = await Serial.findOne({serialNumber: serials[j]}).catch(err => null); //find serial

            if(serial){

                serial.history.map((action) => {
                    if(action.action == "Tested" && action.orderNumber == req.params.orderNumber) //has it been tested for this order
                    {
                        serialTests[serial.serialNumber] =  action.passed; //result of test
                        return;
                    }
                }); 
            }
            else{
                return res.status(400).json({
                    message: "Could not find serial" + serials[j],
                })
            }
        }
    }

    res.status(200).json(serialTests);
});

router.post("/create", inputCheck, async(req, res) => {

    const errors =  validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            message: errors.array()[0].msg,
        });
    }

    const {orderNumber, customerId, to, shipTo, orderDate, items} = req.body;

    //check if exists, and if customer exists
    const isDuplicate = await Order.findOne({orderNumber}).catch(err => null);
    const customer = await Customer.findById(customerId).catch(err => null);

    if(isDuplicate)
    {
        return res.status(422).json({
            message: "Order Already Exists",
        });
    }

    if(!customer){
        return res.status(422).json({
            message: "Customer does not exist",
        });
    }

    for(let i = 0; i < items.length; i++)
    {
        //are they all valid items
        const validItem = await Product.findOne({productId: items[i].productId}).catch(err => null);
    
        if(!validItem){
            return res.status(400).json({
                message: "" + items[i].productId + " product does not exist",
            });
        }
    }

    const newOrder = new Order({orderNumber, customerId, to, orderDate, shipTo, items}); //creat new order

    await newOrder.save()
          .then((order) => {
              res.status(201).send(order);
          })
          .catch((error) => {
              res.status(422).json({
                  message: error.message,
              })
          });
});


module.exports = router;