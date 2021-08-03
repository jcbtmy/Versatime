#!/bin/sh

        mongoimport -d site -c orders --file site/orders.json  --uri "mongodb://mongo:27017"
        mongoimport -d site -c users --file site/users.json  --uri "mongodb://mongo:27017"
        mongoimport -d site -c customers --file site/customers.json  --uri "mongodb://mongo:27017"
        mongoimport -d site -c serials --file site/serials.json  --uri "mongodb://mongo:27017"
        mongoimport -d site -c serialcounters --file site/serialcounters.json --uri "mongodb://mongo:27017"
        mongoimport -d site -c products --file site/products.json  --uri "mongodb://mongo:27017"
