const express = require("express");
const bcrypt =  require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/Auth");
const { check, validationResult} = require("express-validator");

const router = express.Router();

const User = require("../models/User");

const inputCheck = [
    check("username", "Please enter a valid userName")
        .not()
        .isEmpty(),
    check("password", "Please enter a valid password").isLength({
            min: 8
        })
];


const jwtSign = (payload, res) => {
    jwt.sign(
        payload,
        "randomString",
        {
            expiresIn: 60,
        },
        (err, token) => {
            if(err){
                console.log(err);
                return;
            }
            res.status(200).json({
                token
            });
        }
    );
}




router.post(
    "/signup",
    inputCheck,
    async (req, res) => {
        const errors = validationResult(req);

        const creator = await User.findById(req.session.userID);

        if(!creator || creator.role !== 0){
            res.status(400).json({
                message: "Permission to create accounts not allowed",
            });
        }
       
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: errors.array(),
            });
        }   
        
        const { username, password, role} = req.body;

        try {
            let user = await User.findOne({
                username
            });

            if(user) {
                return res.status(400).json({
                    msg: "username already exists",
                });
            }

            user = new User({
                username, password, role
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            res.status(200).json(user);

        } catch (err) {
            console.log(err.message);
            res.status(500).json({msg: "Error Saving User"});
        }
    }
);


router.post("/logout", async(req, res) => {
        req.session.destroy();
        res.redirect(301, "/user/login");
});

router.post(
    "/login",
    inputCheck,
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty){
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {username, password } = req.body;

        try{
            let user = await User.findOne({
                username
            });

            if(!user){
                return res.status(400).json({
                    msg: "Incorrect username or password"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch)
            {
                return res.status(400).json({
                    msg: "Incorrect username or password"
                });
            }

            req.session.userID = user.id;
            req.session.save();
            res.redirect(308, "/");
        
            

        } catch (e) {
            console.log(e);
            res.status(500).json({
                msg: "Error on Server"
            });
        }
    }
);

router.get( "/login", (req,res) => {
    res.sendFile("login.html", {root: __dirname + "/../public/build/"});
});

router.get("/userInfo", auth, async(req,res) => {
    await User.findById(req.session.userID, "username role")
                .then((doc) => {
                    res.status(200).send(doc);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).send({
                        msg: err.message,
                    });
                });
    
});

module.exports = router;