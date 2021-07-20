curl -i -X POST \
	-H 'Content-Type: application/json' \
	-d '{"productName" : "BSC" , "productId" : "52000-00", "serialRequired": true }' \
	http://localhost/orders/create
