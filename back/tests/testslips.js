const http = require('http');

const data = JSON.stringify({ 
                        orderNumber: 18115, 
                        RMANumber: 18223,
                        boxNumber: 1,
                        trackingNumber: "3qajfkldsf",
                        items: [
                          {   
                            productId: '50750-00',
                            quantity: 5,
                          }
                        ],
                        returnedItems: [
                          {
                            productId: '50750-00',
                            quantity: 1,
                          },
                        ],
                        
});

const options = {
  hostname: 'localhost',
  port: 80,
  path: '/api/packingSlips/create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()