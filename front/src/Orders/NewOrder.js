
import { stringSimilarity } from "string-similarity-js";

import XLSX from "xlsx";


function compareCustomerNames(customerName, customers) {
    for(let i = 0; i < customers.length; i++)
    {
        if(stringSimilarity(customerName, customers[i].customerName) > 0.60 )
        {
            return customers[i];
        }
    }
    return {customerName: "", _id: ""};
}


export function ParseOrderFile(event, products, customers, newOrders){
           
        const bstr = event.target.result;
        const wb = XLSX.read(bstr, {type:'binary', cellDates: true});
           
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
           
        const data = XLSX.utils.sheet_to_json(ws, {header:1});

            const head = data[0]; //get the head of the data
            data.shift(); //move head out of the data
            let order = {};
            
            for(let i = 0; i < data.length; i++)
            {
                const entry = data[i];

                let obj = {};
                
                for(let j = 0; j < entry.length; j++){
                    
                    const col = entry[j];
                    obj[head[j]] = col; //set each column to its column name
                }

                if(!obj["SO No"] || obj["SO No"] === undefined) //check if entries match the head
                {
                    return;
                }

                
           
                if(Object.keys(order).length !== 0 && Number(obj["SO No"]) !== order.orderNumber)
                {
                    //if a new order push old order into array
                    newOrders.push(order);
                    order = {}
                }

                if(Object.keys(order).length === 0){

                    let shipTo = "";
                    let To = "";
                    //Get all the info about the order
                    order.orderNumber= Number(obj["SO No"]);
                    order.orderDate = new Date(obj["SO Date"]);
                    order.customer = compareCustomerNames(obj["Customer Name"], customers);
                    order.to = obj["Customer Name"] + "\n";
                    order.shipTo = "";
                    order.items = [];

                    //columns for customer address
                    for(let j = 11; j < 17; j++){
                        //catch city,state column
                        if(entry[j] === "")
                            continue;
                         To += (j !== 13 ) ? "" + entry[j] + "\n": entry[j] + ", " ;
                    }
                    //column for shipping address
                    for(let j = 17; j < 24; j++ ){
                        //catch city, state column
                        if(entry[j] === "")
                            continue;
                        shipTo += (j !== 20) ?  "" + entry[j] + "\n": entry[j] + ", ";
                    }
                      
                    
                    order.shipTo = shipTo;
                    order.to = To;
                }

                const product = products.find((product) =>  obj["Item ID"].startsWith(product.productId)); //find the product

                if(product){

                    if(product.productPackage.length) //handle package items with tablets, modules, and mounts
                    {
                       
                        for(let j = 0 ; j < product.productPackage.length; j++){

                            const productId = product.productPackage[j];

                            const isDuplicate = order.items.find((item) => (item.productId === productId)); //find duplicate
 
                            if(isDuplicate){ //if duplicate add to quantity
                                isDuplicate.quantity += parseInt(obj["Qty Ordered"]); 
                            }
                            else{ //add to items list
                                order.items.push({  quantity: parseInt(obj["Qty Ordered"]), 
                                                    productId: productId,
                                                    productName: obj["Line Description"],
                                                    serials: [],
                                });
                            }
                        }
                    }
                    else{ 

                        const isDuplicate = order.items.find((item) => (item.productId === product.productId));

                        if(isDuplicate){
                            isDuplicate.quantity += parseInt(obj["Qty Ordered"]); 
                        }
                        else{
                            order.items.push({  quantity: parseInt(obj["Qty Ordered"]), 
                                                productId: product.productId,
                                                productName: obj["Line Description"],
                                                serials: [],
                                            });
                        }
                    }
                }
                

            }

}
