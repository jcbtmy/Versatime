const http = require('http');

const data = JSON.stringify({ 
  customerId: "608066da516efc5123aa2e06",
  productId: "52000-00",

});

const options = {
  hostname: 'localhost',
  port: 80,
  path: '/serials/create',
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