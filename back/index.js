const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const InitiateMongodb = require("./config/db.js");
const dotenv = require("dotenv");


const auth = require("./middleware/Auth");
const { v4: uuidv4 } = require('uuid');
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const app = express();



const user = require("./routes/user");
const products = require("./routes/products");
const customers = require("./routes/customers");
const orders = require("./routes/orders");
const serials = require("./routes/serials");
const rmas = require("./routes/rmas");
const packingSlips = require("./routes/packingSlips");

dotenv.config({path: __dirname + '/.env'});

const port = process.env.PORT || 80;

const static_path = ( process.env.DEV === '1') ?  "../front/build/" : "./public/build/";

console.log

const db_host = (process.env.DEV === '1') ? "localhost" : "mongo";

InitiateMongodb(db_host);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	name: "sessionCookie",
	genid: () => {return uuidv4();},
	secret: "secret",
	resave: false,
	saveUninitialized: true,
	cookie: {httpOnly: false},
	store: MongoStore.create({client: mongoose.connection.getClient()}),
}));

app.use("/user", user);
app.get("/", auth);
app.use("/api/products", products );
app.use("/api/customers", customers);
app.use("/api/orders", orders);
app.use("/api/serials", serials);
app.use("/api/rmas", rmas);
app.use("/api/packingSlips", packingSlips);


//Handles all of the frontend routing requests

app.get("/SalesOrders", async(req, res) => {
    res.sendFile("index.html", {root: static_path});
})

app.get("/SalesOrders/:orderNumber", async(req, res) => {
    res.sendFile("index.html", {root: static_path});
});

app.get("/RMAs", async(req, res) => {
    res.sendFile("index.html", {root: static_path});
})

app.get("/RMAs/:RMANumber", async(req, res) => {
    res.sendFile("index.html", {root: static_path});
});

app.get("/Shipping", async(req, res) => {
    res.sendFile("index.html", {root: static_path});
});

app.get("/SerialNumbers", async(req, res) => {
    res.sendFile("index.html", {root: static_path});
});

app.get("/SerialNumbers/:serialNumber", async(req, res) => {
    res.sendFile("index.html", {root: static_path});
}); 

app.get("/Customers", async(req, res) => {
    res.sendFile("index.html", {root: static_path});
}); 

app.get("/Customers/:_id", async(req, res) => {
    res.sendFile("index.html", {root: static_path});
}); 



app.use(express.static(static_path));

app.listen(port, (req, res) => {
	console.log("Server Running on PORT$" + port );
});

