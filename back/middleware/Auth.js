const User = require("../models/User");
const mongoose = require("mongoose");


module.exports = (req, res, next) => {
    
    if(!req.session.userID){
        res.redirect('/user/login');
    }
    else{
        
        let user = User.findById(req.session.userID).exec();
        if(!user)
        {
            res.redirect('/user/login');
        }
        else{
            next();
        }
    }
}