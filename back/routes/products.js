const express = require("express");
const auth = require("../middleware/Auth");
const { check, validationResult} = require("express-validator");

const router = express.Router();


const Product = require("../models/Products");

const inputCheck = [
    check("productId", "Please enter a valid Product Id")
        .not()
        .isEmpty(),
    check("productName", "Please enter a valid Product Name")
        .not()
        .isEmpty(),
    check("serialRequired", "Please enter serial required")
        .not()
        .isEmpty(),
];


router.get("/", async(req, res) => {
    const filter = {};
    const products = await Product.find(filter, "productId productName serialRequired productPackage").catch(err => null);

    if(!products)
    {
        return res.status(500).json({
            msg: "Internal Server Error",
        });
    }
    
    res.send(products);
} );



router.post("/create", inputCheck , async(req, res) => {

    const errors =  validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const isDuplicate = await Product.findOne({productId: req.body.productId});

    if(isDuplicate)
    {
        return res.status(400).json({
            msg: "Product already exists",
        });
    }

    const newProduct = new Product(req.body);

    await newProduct.save()
        .then((doc) => res.status(200).send(doc))
        .catch((err) => res.status(400).send("Error saving product"));

});

module.exports = router;
