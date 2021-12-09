# Versatime


## Introduction

This app was written as an internal piece of software written to handle all functions associated with VersaCall's serial numbers. This includes creaton upon initial sales orders, return merchandising, testing, and shipping. This application was written following RESTful architechture.

## Requirements

Technology Stack
* Node JS
* Express
* Mongoose
* React
* MongoDB
* docker
* Jenkins(Optional)
* docker-compose



## Installation

There is an optional file for seeding the mongo database named docker-compose-inital.yml.

(
    This process can be automated using the jenkins file for building and deploying to a remote server. Jenkins user needs to have a ssh key setup with the server in order to properly deploy
)

### Build

    npm run build --prefix front/
    rm -r back/public/*
    mv front/build/ back/public/
    docker build back/ -t jcbtmy/versatime

    **These steps are automated in the Jenkinsfile script**

### Run

    docker-compose up -d

    **This step is automated for a remote machine in the jenkinsfile**

## Structure

### This is the basic structure of the application. I will highlight important parts for modification.

     back
        ├── config
        │   └── db.js                      //settings for mongodb connection
        ├── models                         //list of all collection
            ├── Customers.js
            ├── Order.js
            ├── PackingSlipCounter.js
            ├── PackingSlip.js            //assocaition between orders, and rmas
            ├── Products.js
            ├── RMA.js
            ├── SerialCounter.js
            ├── Serial.js
            └── User.js
        ── routes               //handles all api endpoints
            ├── customers.js
            ├── orders.js
            ├── packingSlips.js
            ├── products.js
            ├── rmas.js
            ├── router.js
            ├── serials.js
            └── user.js
        front
            src                 //all front end code important parts
            ├── Common         //components used by all other parts
            ├── css
            ├── Customers
            │   └── CustomerDisplay.js
            ├── Orders      
            │   ├── NewItem.js  
            │   ├── NewOrder.js             //contains parser for file upload
            │   ├── OrderItemSerial.js  
            │   ├── OrdersDisplay.js
            │   └── OrderTestRow.js
            ├── RMA
            │   ├── RMADisplay.js
            │   ├── RMAItem.js
            │   └── RMARepairs.js
            ├── Serials
            │   ├── NewAction.js
            │   ├── NewSerial.js
            │   ├── SerialDymoXML.js    //formatter for dymo label printer
            │   └── SerialsDisplay.js
            ├── Shipping
            │   ├── ShippingDisplay.js
            │   ├── ShippingItems.js
            │   ├── ShippingPrintSheet.js   //formatter of packing slip in, mostly JSX
            │   └── ShippingServices.js
            ├── User
            │   └── AddUser.js
            └── VersaTime.js      



## Maintainers

    Jacob Tooomey -- jcbtmy@gmail.com
