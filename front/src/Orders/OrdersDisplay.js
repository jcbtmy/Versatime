
import React from "react";
import {SearchBar} from "../Common/Search";
import {Display, DisplayItem} from "../Common/Display";
import {Recent, RecentItem} from "../Common/Recent";
import HeadDisplay from "../Common/HeadDisplay";
import ItemTabs from "../Common/ItemTabs";
import {FileUploadButton, SubmitButton} from "../Common/Buttons";
import {GenTable, GenTableHead, GenTableBody, Row} from "../Common/TemplateTable";
import {Message} from "../Common/Message";
import {
  IdentifierField,
  DateField,
  CustomerField,
  ShippingField,
  ToField,
  } from "../Common/Fields";

import {serialXML, getDymoLabel, getDymoPrinter} from "../Serials/SerialDymoXML";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import {OrderTestRow} from "./OrderTestRow";
import {ParseOrderFile} from "./NewOrder";
import NewItem from "./NewItem";







export default class Orders extends React.Component {

      constructor(props)
      {
        super(props);
        this.state = {

          recentOrders: null,

          rows: null,

          orderNumber: null,
          customer: null,
          to: null,
          shipTo: null,
          items: null,
          orderDate: null,

          change: false,
          message: null,
      
          uploadedOrders: null,
          file: null,
          newOrder: false,


          tab: null,
        };
      }


      updateDetails = () =>
      {

        const headers = {

            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                customerId:   this.state.customer._id,
                orderDate:    this.state.orderDate,
                to:           this.state.to,
                shipTo:       this.state.shipTo,
            }),
        };

        fetch("/api/orders/updateDetails/" + this.state.orderNumber, headers)
        .then((res) => {

          if(res.ok)
          {
            return this.setState({
                                      message: {
                                          error: false, 
                                          text: "Order details successfully updated"
                                      }, 
                                      change: false,
                                  });
          }

          res.json().then((err) => this.setState({
                                                    message: {  
                                                                error: true, 
                                                                text: err.msg
                                                    }
                                                  }));
        })
        .catch(err => this.setState({message: {error: true, text: err.msg}}));
        
      }

      getOrder = async(orderNumber) => {


        fetch("/api/orders/" + orderNumber)
            .then((res) => {

                if(res.ok)
                {
                  return res.json();
                }  

                res.json().then((err) => this.setState({message: { 
                      error: true,
                      text: err.message
                    }
                }));
            })
            .then(order => {

                    if(!order) {return;}

                    const customer = this.props.customers.find(customer => customer._id === order.customerId);//find customer from id

                    //update state with fetched order
                    this.setState({
                              orderNumber:  order.orderNumber,
                              customer:     customer,
                              to:           order.to,
                              shipTo:       order.shipTo,
                              orderDate:    new Date(order.orderDate),
                              items:        order.items,
                              newOrder:     false,
                              change:       false,
                    });

                    this.createRows(order);

                    this.props.location.pathname += `/${order.orderNumber}`;
            })
            .catch(err => this.setState({message: {error: true, text: err.toString()}}));

      }

      componentDidMount(){

        const  state = this.props.location.state;

        if(!state) //did the router render component with a state?
        {
          this.fetchRecent();
        }
        else if(state.orderNumber) //check if the router passed a prop to the newly rendered component
        {
          this.getOrder(state.orderNumber);
        }

      }
      printSerial = (serialNumber) =>{

        const dymo = window.dymo;

        const printerName = getDymoPrinter(dymo);

        if(!printerName)
        {
            this.setState({message: {error: true , text: "No Printer Found"}});
            return;
        }

        const label = getDymoLabel(dymo, serialXML);

        if(!label)
        {
            this.setState({message: {error: true, text: "Could not create label"}});
            return;
        }

        label.setObjectText("BARCODE", serialNumber);
        label.print(printerName);
      }


      /*
        Create table entries based on fetch data requires aysnc
          -cant move this to render because of fetch
          -need to await for response to determine how to create rows, therefore nothing will return to render
          -needed to use setState to update instead
          -may need to move this to server side with the inital order get function
      */
      createRows = async(order) => {

        const items = order.items;
        const products = this.props.products;
        const rows  = [];

        
        let serialTests;
        
        if(!this.state.newOrder) //if not new order, ask server for the tests of order's serial numbers
        {
            const resp  = await fetch("/api/orders/testedSerials/" + order.orderNumber);

            if(resp.ok)
            {
                serialTests = await resp.json();
            }
        
            else{
                const error = await resp.json();
                this.setState({message: {error: true, text: error.message}});
            }
        }

        if(items !== undefined && items.length){

            items.map(
                (item, i) => {

                    const productName = this.props.products.find((product) => product.productId === item.productId).productName;

                    const columns = [productName, item.productId, <b>{item.quantity}</b>]; 

                    if(item.serials && item.serials.length){ //if there are serials create testable rows 
                       
                        rows.push(  <OrderTestRow 
                                        columns={columns} 
                                        serials={item.serials}
                                        serialTests={serialTests}
                                        orderNumber={order.orderNumber}
                                        quantity={item.quantity}
                                    />);
                    }
                    else{ //create a standard row
                        columns.push("");
                        columns.push("");
                        rows.push(<Row key={i} items={columns}/>);
                    }
                    
                }
            );
        }

          this.setState({rows: rows});
    }

    createOrder = () => {

        const {orderNumber, orderDate, to, shipTo, customer, items} = this.state;

        if(orderNumber && customer && to && shipTo && items){ //check if neccesary items are there to prevent error
 
            const newOrder = {  //create json obj to send to server
                            orderNumber:  orderNumber, 
                            customerId:     customer._id,
                            to:             to,
                            shipTo:         shipTo,
                            orderDate:      orderDate,
                            items:          items.map((item) => ({productId: item.productId, quantity: item.quantity, serials: []})),  
            };
            
            const headers = {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),

            };

            fetch("/api/orders/create", headers)
                .then((res) => {

                        if(res.ok)
                        {
                            return res.json();
                        }
                        else
                        {
                            res.json().then((error) => this.setState({message: {error: true, text: error.message}}));
                        }
                })
                .then((order) => {

                    if(order) {

                        const customer = this.props.customers.find((customer) => customer._id === order.customerId);

                        this.setState({ //set state to what the order has

                              orderNumber:  order.orderNumber,
                              customer:     customer,
                              orderDate:    order.orderDate,
                              to:           order.to,
                              shipTo:       order.shipTo,
                              newOrder:     false,
                              items:        order.items,
                              message: {
                                  error: false,
                                  text: `${order.orderNumber} successfully created`,
                              }
                        });

                        this.props.updateOrders({orderNumber: order.orderNumber, customer: customer}); //update the root dependency in VersaTime


                    }
                })
                .catch((error) => this.setState({message : {error:true, text: error.message}}));
        }
      }
      
      fetchRecent = () => 
      {
          fetch("/api/orders/recent/6") //get last 6 orders from server
            .then((res) => {

                if(res.ok)
                {
                  return res.json();
                }
                
                res.json().then((err) => this.setState({
                  message: { 
                      error: true,
                      text: err.message
                    }
                }));

            })
            .then((orders) => {

              this.setState({ 
                              orderNumber:  null,
                              items:        null,
                              orderDate:    null,
                              shipTo:       null,
                              to:           null,
                              recentOrders: orders
              });

            })
            .catch((err) => this.setState({message: {error: true, text: err.message}}));

      }

      valueChange = (event, order) => 
      {
        //if no order selected then go back to recents
        if(!order)
        {
          this.fetchRecent();
        }
        else
        {
          this.getOrder(order.orderNumber);
        }

      }

      uploadClick = (event) => 
      {
          //prevent default submit then trigger click() for upload new order file
          event.preventDefault();

          document.getElementById("upload-file").click();

      }

      uploadFile = (event) => 
      {
          
          const file = event.target.files[0]; //get name of file to upload

          const reader = new FileReader();

          reader.onload = (event) => {

            
            const newOrders = []; //create empty obj list for multiple orders

            ParseOrderFile(event, this.props.products,  this.props.customers, newOrders); //fills new orders list

            this.setState({           //make the current order the first entry from the order file
                        uploadedOrders: newOrders, 
                        tab:            0, 
                        orderNumber:    newOrders[0].orderNumber,
                        orderDate:      newOrders[0].orderDate,
                        customer:       newOrders[0].customer,
                        items:          newOrders[0].items,
                        to:             newOrders[0].to,
                        shipTo:         newOrders[0].shipTo,
            });

            this.createRows(newOrders[0]); //create the rows for the products

          };

          reader.readAsBinaryString(file); 
      }

      newOrderFunction = () => 
      {   
          //create an entirely new order 
          this.setState({
                        orderNumber: null,
                        customer:   null,
                        to:         null,
                        shipTo:     null,
                        items:      [],
                        orderDate:  new Date(),
                        newOrder:   true, 
                        recentOrders: null,
                        change:      false,
                        rows: [],
          });
          
      }

      getOptionLabel = (option) => 
      {
        return "" + option.orderNumber + " - " + option.customer.customerName; //how to render options for order selection
      }


      //state setters for order

      change_orderNumber = (event) => 
      {
        const num = parseInt(event.target.value);

        if(Number.isInteger(num))
        {
          this.setState({orderNumber: parseInt(num)});
        }
        else
        {
          this.setState({orderNumber: null});
        }
      }

      change_orderDate = (event) =>
      {
          this.setState({orderDate: new Date(event.target.value), change: true})
      }

      change_orderCustomer = (event, customer) => 
      {
          this.setState({customer: customer, change: true});
      }

      change_orderTo = (event) => 
      {
          this.setState({to: event.target.value, change: true});
      }

      change_shipTo = (event) => 
      {
          this.setState({shipTo: event.target.value, change: true});
      }

      needSerials(items)
      {
        //checks the state of the order to see if serials has been created for it or not
        for(let i = 0; i < items.length; i++)
        {
            if(items[i].serials.length )
                return false;
        }
        return true;
      }


      addItem = (item) => {

          this.setState((prevState) => {
  
            const items = [...prevState.items, item]; //append to end of current state items list

            this.createRows({items: items}); //recreate the new rows

            return {items: items};
          });
      }

      updateTab = (event, newValue) =>{ //when there is a new order update the tab
         
          this.setState((prevState) => {

            const uploadedOrders = prevState.uploadedOrders; 

            const nextOrder = prevState.uploadedOrders[newValue]; //get the next order selected from the list

            uploadedOrders[prevState.tab] = { //save the current order state to the list before updating to next

                ...uploadedOrders[prevState.tab],
                orderNumber:  prevState.orderNumber,
                customer:     prevState.customer,
                orderDate:    prevState.orderDate,
                to:           prevState.to,
                shipTo:       prevState.shipTo,
                items:        prevState.items,

            };

            this.createRows(nextOrder); //create product table for new order

            return {  //finally update current to next and save the changes made to the previous order

                orderNumber:  nextOrder.orderNumber,
                customer:     nextOrder.customer,
                orderDate:    nextOrder.orderDate,
                to:           nextOrder.to,
                shipTo:       nextOrder.shipTo,
                items:        nextOrder.items,

                uploadedOrders: uploadedOrders,

                tab: newValue,
            }

          });
          
      }


      createSerials = () => {

                const headers = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                };


                fetch("/api/orders/createSerials/" + this.state.orderNumber, headers) //server handles checking for if serials are needed
                    .then((res) => {
                        if(res.ok)
                        {
                            return res.json();
                        }

                        res.json().then((err) => this.setState({message: {error:true, text: err.message}}));
                    })
                    .then((order) => {

                        if(order)
                        {
                            this.createRows(order); //create the new product table
                            
                          
                            //update the items table to reflect the serials created for order
                            this.setState({items: order.items, message:{error: false, text: "Successfully created serials"}});

                            for(let i = 0 ; i < order.items.length; i++ )
                            {
                                for(let j = 0; j < order.items[i].serials.length; j++)
                                {
                                    //update root Serial dependency to reflect serials added to db
                                    this.props.updateSerials({serialNumber: order.items[i].serials[j], customer: this.state.customer});
                                    this.printSerial(order.items[i].serials[j]);
                                }

                            }
                        }
                    })
                    .catch((err) => this.setState({message: {error:true, text: err.message}}));
      }

      render() {

        const { newOrder, 
                recentOrders, 
                change,
                orderNumber,
                to,
                rows,
                customer,
                shipTo,
                orderDate,
                items,
                uploadedOrders,
                tab,
                file,
                message,
              } = this.state;

        const {customers, products}= this.props;

        return(
          <Display>
              <SearchBar  label="Sales Orders"
                          options={this.props.orders}
                          getOptionLabel={this.getOptionLabel}
                          newOrderFunction={this.newOrderFunction}
                          onChange={this.valueChange}    
              />

              {message && <Message text={message.text} error={message.error} clear={() => this.setState({message: null})} />}

             
              {
                newOrder &&  
                <DisplayItem>
                  <FileUploadButton         
                    uploadFile={this.uploadFile}
                    onChange={this.uploadClick}
                    file={file} 
                  />
  

                {   uploadedOrders &&
                            <ItemTabs onChange={this.updateTab} value={tab} tabLabels={uploadedOrders.map((order) => order.orderNumber)}/>
                }
                </DisplayItem>
              }

              {
                recentOrders && !newOrder && !orderNumber &&
                <DisplayItem>
                  <Typography variant="h5">Recent Orders</Typography>
                  <Recent>
                    {
                      recentOrders.map((item) => {

                        const customer = customers.find((c) => c._id === item.customerId);
                        const date = new Date(item.orderDate);

                        return (
                                <Button style={{textTransform: "none"}} onClick={(e) => this.getOrder(item.orderNumber)}>
                                    <RecentItem>
                                                {[  "Order: " + item.orderNumber, 
                                                  customer.customerName, 
                                                  "" + date.getMonth() + "/" + date.getDay() + "/"+ date.getFullYear(),
                                                ]}
                                    </RecentItem>
                                </Button>
                        );
                      })
                    }
                  </Recent>
                </DisplayItem>
              }

             { (newOrder || orderNumber) 
                &&
                <DisplayItem>
                  <Typography variant="h5">Order Details</Typography>
                  <HeadDisplay 
                    edit={!newOrder}
                    updateHead={this.updateDetails}
                    change={change}
                  >
                        <IdentifierField  
                                  label="Order Number"         
                                  value={orderNumber} 
                                  onChange={this.change_orderNumber}
                                  allowEdit={newOrder}
                          />
                        <CustomerField  
                                customers={customers} 
                                value={customer}
                                key={orderNumber}
                                onChange={this.change_orderCustomer}
                        />
                        <DateField   
                                value={new Date(orderDate)} 
                                label={"Order Date"}  
                                onChange={this.change_orderDate}
                        />
                        <ToField     
                                value={to}
                                onChange={this.change_orderTo}
                        />
                        <ShippingField
                                value={shipTo}
                                onChange={this.change_shipTo}
                        />
                  </HeadDisplay>
                </DisplayItem>
              }
              {
                newOrder &&
                    <DisplayItem>
                      <Typography variant="h5">
                          New Item
                      </Typography>
                      <NewItem products={products}
                                      key={items}
                                      addItem={this.addItem}
                                />
                    </DisplayItem>
              }
              {
                items && rows &&
                <DisplayItem>
                        <Typography variant="h5">Order Items</Typography>
                        <GenTable>
                          <GenTableHead>
                            <b>Item Name</b>
                            <b>Product ID</b>
                            <b>Quantity</b>
                            <b>Tested</b>
                            <b></b>
                          </GenTableHead>
                          <GenTableBody>
                            {rows}
                          </GenTableBody>
                        </GenTable>
                </DisplayItem>
                
              }

              {   !this.state.newOrder 
                  && 
                  items
                  &&
                  this.needSerials(items)
                  &&
                  <Button style={{marginLeft:"auto", marginTop: 20, alignSelf: "flex-start"}} 
                          onClick={this.createSerials} 
                          color="primary" 
                          variant="contained" 
                          size="large" >
                              Create Serials
                  </Button>
              }
              {   this.state.newOrder 
                  && 
                  <SubmitButton     
                      onClick={this.createOrder} 
                  >
                          Submit Order
                  </SubmitButton>
               }
             
          </Display>
          
      );


    }

}

  