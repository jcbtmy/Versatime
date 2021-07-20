#!/bin/sh
mongoimport -d site -c orders -f site/orders.json --jsonArray --uri "mongodb://mongo:27017"
mongoimport -d site -c users -f site/users.json --jsonArray --uri "mongodb://mongo:27017"
mongoimport -d site -c customers -f site/customers.json --jsonArray --uri "mongodb://mongo:27017"
mongoimport -d site -c serials -f site/serials.json --jsonArray --uri "mongodb://mongo:27017"
mongoimport -d site -c serialcounters -f site/serialcounters.json --jsonArray --uri "mongodb://mongo:27017"
mongoimport -d site -c products -f site/products.json --jsonArray --uri "mongodb://mongo:27017"