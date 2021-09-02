import {SearchBar} from "../Common/Search";
import React, {useState} from 'react';
import {Display, DisplayItem} from "../Common/Display";
import HeadDisplay from "../Common/HeadDisplay";
import {Message} from "../Common/Message";
import ItemTabs from "../Common/ItemTabs";
import { NewButton, DownloadPackingSlipButton, SubmitButton, UpdatePackingSlipsButton } from "../Common/Buttons";
import {GenTable, GenTableRow,  GenTableHead, GenTableBody} from "../Common/TemplateTable";
import { 
        IdentifierField, 
        RMAField, 
        ShippingField, 
        TrackingNumberField,
        ToField,
        OrderField,
        BoxNumberField,
        POField,
        ShippingServiceField,

    } from "../Common/Fields";

import ShippingItems, {ItemDropTable} from "./ShippingItems";
import ShippingServiceList from "./ShippingServices";


import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from '@material-ui/icons/Delete';

import { Button, IconButton, TextField } from "@material-ui/core";


import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import ShippingPrintSheet from "./ShippingPrintSheet";


function QuantityChange(props){ //component to change quantity of item in packing slip

    const [edit, setEdit] = useState(false);

    const onDoubleClick = (event) => {
        setEdit(true);
    }

    const onEnterKey = (event) => {
        if(event.key === "Enter")
        {
            setEdit(!edit);
        }
    }

    return  (
        <div 
            onDoubleClick={onDoubleClick}
            onKeyDown={onEnterKey}
        >
            {
                edit && 
                <TextField
                    value={props.value}
                    onChange={props.onChange}
                    id="Quantity"
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    style={{width: 100}}
                />
            }
            {
               !edit &&
                props.value
            }
        </div>
    )

}

export default class ShippingDisplay extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            
            orders: null,
            rmas: null,
            newShipment: false,
            options: null,

            change: null,
            message: null,

            packingSlips: null,

            downloadSlips: false,

            tab: 0,

            downloadSlipIndex: 0,

        };

        this.pdf = null;
    }

    componentDidMount(){

        //when component mounts, map all orders and rmas into the same list to choose for packing slips
        const orderandrma = [];
        //format {id, text: what to render, type: (rma | order)}

        this.props.orders.map((order) => orderandrma.push({ id: order.orderNumber, text: "Order - "  + order.orderNumber, customer: order.customer, type: "Order" }));

        this.props.rmas.map((rma) => orderandrma.push({ id: rma.RMANumber, text: "RMA - " + rma.RMANumber, customer: rma.customer, type: "RMA"}));

        this.setState({options: orderandrma});
    }

    downloadPackingSlips = () => {
        this.setState({downloadSlips: true}, this.getSlipImage); //set the slip to download and call the slip image
        //downloadslips: true renders it to the dom
    }

    getSlipImage = () => {

        const jsPDF = window.jsPDF; //library for pdf
        const html2canvas = window.html2canvas; //library for canvas from html

        const page = document.getElementById("printSheet"); //get the rendered dom element 
        page.style.display="block"; //display it


        html2canvas(page) //create a canvas
           .then((canvas) => {
                const imgData = canvas.toDataURL('image/png'); //get image data from canvas

                page.style.display="none"; //remove the display

                if(this.pdf)
                {    
                    this.pdf.addPage(); //add the page to the pdf if it already exists
                    this.pdf.addImage(imgData, 'JPEG', 0, 0);
                }
                else{   //if does not exists then create new pdf
                    this.pdf = new jsPDF();
                    this.pdf.addImage(imgData, 'JPEG', 0, 0);
                }
                
                if(this.state.downloadSlipIndex === this.state.packingSlips.length - 1){

                    //if its that last slip to render then download the page
                    this.pdf.save("PackingSlips.pdf");
                    this.pdf = null;

                    this.setState({downloadSlipIndex: 0, downloadSlips: false}); //reset state remove render from dom

                }
                else{
                    //probrably an easier way to do this, maybe render all packing slips to the dom at once then take picture
                    //instead of rendering each page
                    this.setState({downloadSlipIndex: this.state.downloadSlipIndex + 1} , this.downloadPackingSlips); //go to the next page
                }
            });
    }

    createPackingSlips = async (event) => {

        const packingSlips = this.state.packingSlips;

        //loop through all packing slips to get the ones already made and add new ones
        for(let i = 0; i < packingSlips.length; i++)
        {
            if(packingSlips[i].packingSlipNumber !== null) //packing slip already created go to next
            {
                continue;
            }

            const newSlip = { //setup proper format
                trackingNumber:     packingSlips[i].trackingNumber,
                boxNumber:          packingSlips[i].boxNumber,  
                orderNumbers:       packingSlips[i].orderNumbers,
                RMANumbers:         packingSlips[i].RMANumbers,
                items:              packingSlips[i].items,
                customerPO:         packingSlips[i].customerPO,
                shipmentService:    packingSlips[i].shipmentService,
                returnedItems:      packingSlips[i].returnedItems,
            };

            const headers = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newSlip),
            };
    
        

            await fetch("/api/packingSlips/create/", headers)
                .then((res) => {
                    if(res.ok)
                    {
                        return res.json();
                    }
                    res.json().then((err) => this.setState({message: { error: true, text:   err.message, }}));
                })
                .then((slip) => {

                    if(!slip){return;}

                    this.setState((prevState) => {
                        //if a successful create, then update the state
                        const pSlips = [...prevState.packingSlips];
                        pSlips[i] = slip;

                        return {    packingSlips: pSlips, 
                                    message:      {error: false, text: "Packing Slip Successfuly created"}
                                };
                    });
                })
                .catch(err => this.setState({message: {error: true, text: err.message}}));

        }

    }

    fetchPackingSlips = (event, searchObject) => { //function to handle input from the search/select bar

        if(!searchObject)
        {
            return;
        }

        let requestURL = "/api/packingSlips/findMany/";

        if(searchObject.type === "Order") //if order update url
        {
            requestURL += "?orderNumber=" + searchObject.id;
        }
        else if(searchObject.type === "RMA") //elif rma update url
        {
            requestURL += "?RMANumber=" + searchObject.id;
        }

        fetch(requestURL)
            .then((res) => {
                
                if(res.ok)
                {
                    return res.json();
                }
                
                res.json().then((err) => this.setState({message : {error: true, text: err.message }}));
            })
            .then((packingSlips) => {

                if(!packingSlips){return;}
            
                if(packingSlips.length){ 
                        //go find the order | rma to get items, shipment info etc,

                        if(packingSlips[0].RMANumbers && packingSlips[0].RMANumbers.length) //if rma then go grab the rma for it
                        {
                            this.fetchRMAs(packingSlips[0].RMANumbers);
                        }
                        else{
                            this.setState({rmas: null});
                        }

                        if(packingSlips[0].orderNumbers && packingSlips[0].orderNumbers.length) //if orderr then go grab order for it
                        {
                            this.fetchOrders(packingSlips[0].orderNumbers);
                        }
                        else{
                            this.setState({orders: null});
                        }
                }
                else{

                    //if no packing slips are made for order, go grab the correct (order | rma) to get items, info etc
                    if(searchObject.type === "Order")
                    {
                        this.fetchOrders([searchObject.id]);
                        this.setState({rmas: null});
                    }

                    if(searchObject.type === "RMA")
                    {
                        this.fetchRMAs([searchObject.id]);
                        this.setState({orders: null})
                    }
                    
                    //add new slip to the list
                    packingSlips.push({
                        packingSlipNumber:  null,
                        trackingNumber:     null,
                        customerPO:         null,
                        shipmentService:    null,
                        items:              [],
                        returnedItems:      [],
                        boxNumber:          1,
                        RMANumbers:          (searchObject.type === "RMA") ? [searchObject.id] : null,
                        orderNumbers:        (searchObject.type === "Order") ? [searchObject.id] : null,
                    });
                }

                this.setState({
                    packingSlips:       packingSlips, 
                    tab:                0,
                });

            })
            .catch((err) => this.setState({message: {error: true, text: err.message}}));
    }

    fetchOrders = (orderNumbers) => {

        let URLSearchString = "/api/orders/many?";

        orderNumbers.forEach((orderNum, index) => {

            URLSearchString += `orderNumbers[${index}]=${orderNum}`;

            if(index !== (orderNumbers.length - 1))
                URLSearchString += "&";
        });

            fetch(URLSearchString)
                .then((res) => {
                    
                    if(res.ok)
                    {
                        return res.json();
                    }
                    
                    res.json().then((err) => this.setState({ message: {error: true,  text: err.message} }));

                })
                .then((orders) => {

                    if(!orders){return}

                    this.setState({orders: orders});
                })
                .catch((err) => this.setState({message: {error: true, text: err.message}}));

    }

    
    fetchRMAs = (RMANumbers) => {

        let URLSearchString = "/api/rmas/many?";

        RMANumbers.forEach((rmaNum, index) => {

            URLSearchString += `RMANumbers[${index}]=${rmaNum}`;

            if(index !== (RMANumbers.length - 1))
                URLSearchString += "&";
        });

        fetch(URLSearchString)
            .then((res) => {

                if(res.ok)
                {
                    return res.json();
                }

                res.json().then((err) => this.setState({message: {error: true, text: err.message} }));
            })
            .then((rmas) => {
                if(!rmas){return;}

                this.setState({rmas: rmas});
            })
            .catch((err) => this.setState({message: {error: true, text: err.message} }));

    }

    getAvailableItems(rmas, orders, packingSlips)
    {
        //get all available items from orders, rmas, and remove all items from the packing slips
        const avaiableItems = [];

        if(orders){
            orders.forEach(order => {
                order.items.forEach(
                (item) => { //get order items
                    avaiableItems.push({
                        productId: item.productId,
                        quantity: item.quantity,
                    });
                });
            });
        }

        if(rmas){ //get rma items
            rmas.forEach((rma) => {
                rma.items.forEach((item) => {
                    for(let i = 0; i < avaiableItems.length; i++)
                    {
                        if(avaiableItems[i].productId === item.productId)
                        {
                            avaiableItems[i].quantity += 1;
                            return;
                        }
                    }

                    avaiableItems.push({
                        productId: item.productId,
                        quantity: 1,
                    });

                });
            });
        }

        if(packingSlips){
            packingSlips.forEach((packingSlip) => {

                if(packingSlip.items){ //check items in packing slip
                    packingSlip.items.forEach((item) => {
                        for(let i = 0; i < avaiableItems.length; i++)
                        {
                            if(avaiableItems[i].productId === item.productId && avaiableItems[i].quantity - item.quantity >= 0)
                            {  
                                avaiableItems[i].quantity -= item.quantity;
                                return;
                            }
                        }
                    });
                }

                if(packingSlip.returnedItems){ //check return items in packing slip(for rmas etc)
                    packingSlip.returnedItems.forEach((item) => {
                        for(let i = 0; i < avaiableItems.length; i++)
                        {
                            if(avaiableItems[i].productId === item.productId && avaiableItems[i].quantity - item.quantity >= 0)
                            {  
                                avaiableItems[i].quantity -= item.quantity;
                                return;
                            }
                        }
                    });
                }
            })
        }

        return avaiableItems;

    }

    addItem = (item) => {

        //add to packingslip items
        this.setState((prevState) => {

            const tab = prevState.tab;
            const slips = prevState.packingSlips;
            const items = prevState.packingSlips[tab].items;

            for(let i = 0; i < items.length; i++)
            {
                if(items[i].productId === item.productId) //if already exists add to quantity
                {
                    items[i].quantity += item.quantity;
                    slips[tab].items = items;

                    return {
                        packingSlips : slips,
                    };
                }
            }

            slips[tab].items.push(item);

            return {packingSlips: slips};
        });
    }


    addReturnedItem = (item) => {

        //add to returned items

        this.setState((prevState) => {

            const tab = prevState.tab;
            const slips = prevState.packingSlips;
            const items = prevState.packingSlips[tab].returnedItems;

            for(let i = 0; i < items.length; i++)
            {
                if(items[i].productId === item.productId)
                {
                    items[i].quantity += item.quantity;
                    slips[tab].returnedItems = items;

                    return {
                        packingSlips : slips,
                    };
                }
            }

            slips[tab].returnedItems.push(item);

            return {packingSlips: slips};
        });
    }
    


    addPackingSlip = () => {
        //add new packing slip to list
        this.setState((prevState) => {

            const packingSlips = prevState.packingSlips;

            const length = prevState.packingSlips.length;

            packingSlips.push({
                packingSlipNumber:  null,
                boxNumber:          packingSlips[length - 1].boxNumber + 1, //add new packing slip
                trackingNumber:     null,
                orderNumbers:       packingSlips[length - 1].orderNumbers ? packingSlips[length - 1].orderNumbers : null,
                RMANumbers:         packingSlips[length - 1].RMANumbers   ? packingSlips[length - 1].RMANumbers : null,
                customerPO:         null,
                shipmentService:    null,
                items: [],
                returnedItems: [], 
            });

            return {packingSlips: packingSlips, tab: length};
        })
    }

    updateTab = (event, newValue) => {
        this.setState({tab: newValue})
    }
    
    updateSlips = () => {

        const packingSlips = this.state.packingSlips;

        for(let i = 0; i < packingSlips.length; i++){ //loop through all slips and update them seperately

            if(packingSlips[i].packingSlipNumber === null) //if not created yet dont update
            {
                continue;
            }

            const updatedSlip = {
                packingSlipNumber:  packingSlips[i].packingSlipNumber,
                orderNumbers:       packingSlips[i].orderNumbers,
                RMANumbers:         packingSlips[i].RMANumbers,
                trackingNumber:     packingSlips[i].trackingNumber,
                boxNumber:          packingSlips[i].boxNumber,
                shipmentService:    packingSlips[i].shipmentService,
                customerPO:         packingSlips[i].customerPO,
                items:              packingSlips[i].items,
                returnedItems:      packingSlips[i].returnedItems,
            };

            const headers = {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(updatedSlip),
            };


            fetch(`/api/packingSlips/update/${packingSlips[i].packingSlipNumber}`, headers)
                .then((res) => {
                    if(res.ok)
                    {
                        
                        this.setState({ message:    {
                                                        error: false,   
                                                        text: "Packing slip details successfully updated"
                                                    },
                                        change: false,
                                    });
                        return;
                    }

                    res.json().then((err) => this.setState({message: {error: true, text: err.message}}));
                })
                .catch((err) => this.setState({message: {error: true, text: err.toString()}}));
        }
    }

    change_ItemQuantity = (e, i) => {
            //change amount of iten in packing slip
            this.setState((prevState) => {

                const slips = prevState.packingSlips;

                slips[prevState.tab].items[i].quantity = e.target.value;

                return {packingSlips: slips}
            });
    }

    change_ReturnedItemQuantity = (e, i) => {
        //change amount of returned item in packing slip
        this.setState((prevState) => {
            const slips = prevState.packingSlips;

            slips[prevState.tab].returnedItems[i].quantity = e.target.value;

            return {packingSlips: slips}
        });
    }

    change_trackingNumber = (event) => {
        //change tracking number for a slip
        this.setState((prevState) => {
            const slips = prevState.packingSlips;

            slips[prevState.tab].trackingNumber = event.target.value;

            return  { packingSlips : slips};
        })
    }

    change_shipmentService = (event, service) => {
        //change shipment service for all slips
        this.setState((prevState) => {
            const slips = prevState.packingSlips;
        
            for(let i = 0; i < slips.length; i++)
            {
                slips[i].shipmentService = service;
            }

            return {packingSlips: slips};
        });
    }

    change_customerPO = (event) => {

        this.setState((prevState) => {
            //change po for all slips
            const slips = prevState.packingSlips;
        
            for(let i = 0; i < slips.length; i++)
            {
                slips[i].customerPO = event.target.value;
            }

            return {packingSlips: slips};
        });
    }

    change_RMA = (event, rmas) => {

        const RMANumbers = (rmas) ? rmas.map(rma => rma.RMANumber) : null;

        this.setState((prevState) => {

            const slips = [...prevState.packingSlips];
            //change rma for all slips
        
            for(let i = 0; i < slips.length; i++)
            {
                slips[i].RMANumbers = RMANumbers;
            }

            return {packingSlips: slips};
        });

        if(RMANumbers.length){ //if not rma go get it
            this.fetchRMAs(RMANumbers);
        }
        else{
            this.setState({rmas: null});
        }
    }

    change_Order = (event, orders) => {

        //change order for all slip

        const orderNumbers = (orders) ? orders.map((order) => order.orderNumber) : null;

        this.setState((prevState) => {

            const slips = prevState.packingSlips;
        
            for(let i = 0; i < slips.length; i++)
            {
                slips[i].orderNumbers = orderNumbers;
            }
            return {packingSlips: slips};
        });

        if(orderNumbers.length){ //if theres not an order then go get it
            this.fetchOrders(orderNumbers);
        }
        else{
            this.setState({orders: null});
        }
    }


    removeItem = (item, index) => {
        this.setState((prevState) => {

            const slips = prevState.packingSlips;

            slips[prevState.tab].items.splice(index, 1);

            return {packingSlips: slips};
        })
    }

    removeReturnedItem = (item, index) => {

        this.setState((prevState) => {

            const slips = prevState.packingSlips;

            slips[prevState.tab].returnedItems.splice(index, 1);

            return {packingSlips: slips};
        })
    }

    newShipment = () => {
        this.setState({shipment: null, newShipment: true});
    }

    getOptionLabel = (option) => {
        return "" + option.text + " - " + option.customer.customerName;
    }

    needPackingSlips (packingSlips){

        const slips = packingSlips.filter((slip) => slip.packingSlipNumber === null);

        return (slips.length !== 0) ? true: false;
    }

    removePackingSlip = () => {

        if(this.state.packingSlips.length > 1)
        {
            this.setState((prevState) => {
                const slips = prevState.packingSlips;
                const tab = prevState.tab;
                slips.splice(tab, 1);
                
                return {
                    packingSlips: slips,
                    tab: (tab > 0) ? tab - 1 : 0,
                }
            });
        }
    }


    render()
    {
        const {products} = this.props;
        const { 
                newShipment,
                packingSlips,
                options, 
                orders, 
                rmas,
                tab,
                message,
                downloadSlips,
            } = this.state;

        return(
            <Display>
                {
                    options &&
                    <SearchBar  label="Shipping"
                                options={options}
                                getOptionLabel={this.getOptionLabel}
                                onChange={this.fetchPackingSlips}
                                noNew
                    />
                }
                <DisplayItem>
                <Typography variant="h5">Packing Slips</Typography>
                {
                    packingSlips && 
                    <Box display="flex" width={1} style={{gap: 15}}>
                        <ItemTabs onChange={this.updateTab} value={tab} tabLabels={packingSlips.map((slip) => (slip.packingSlipNumber) ? slip.packingSlipNumber : "Box " + slip.boxNumber)}/>
                        <NewButton title="New Packing Slip" onClick={this.addPackingSlip}/>
                    </Box>
                }
                {
                    message && <Message error={message.error} text={message.text} clear={() => this.setState({message: null})} />
                }
                <Box>
                {   packingSlips && packingSlips[tab].packingSlipNumber !== null &&
                    <Box width={1} display="flex" style={{gap: 15}}>
                        <DownloadPackingSlipButton 
                            onClick={this.downloadPackingSlips}
                        />
                        <UpdatePackingSlipsButton
                            onClick={this.updateSlips}
                        /> 
                    </Box>
                }
                {
                   packingSlips && packingSlips[tab].packingSlipNumber === null &&
                 
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.removePackingSlip}
                        >
                            Remove Slip
                       </Button>
                   
                }
                </Box>
                {   
                    (orders || rmas) && packingSlips && 
                    <HeadDisplay 
                        edit={!newShipment}
                        updateHead={this.updateSlipDetails}
                        change={false}
                    >
                        <IdentifierField 
                            value={(packingSlips[tab].packingSlipNumber) ? packingSlips[tab].packingSlipNumber : "TBD when submitted"}
                            label="Packing Slip Number"
                        />
                        <OrderField
                            multiple={true}
                            value={(orders) ? orders : []}
                            orders={this.props.orders}
                            onChange={this.change_Order}    
                        />
                        <RMAField
                            multiple={true}
                            value={(rmas) ? rmas : []}
                            rmas={this.props.rmas}
                            onChange={this.change_RMA}
                        />
                        <ToField
                            value={(orders) ? orders[0].to : rmas[0].to}
                            noEdit={true}
                        />
                        <ShippingField
                            value={(orders) ? orders[0].shipTo: rmas[0].shipTo}
                            noEdit={true}
                        />
                        <TrackingNumberField
                            onChange={this.change_trackingNumber}
                            value={packingSlips[tab].trackingNumber}
                        />
                        <BoxNumberField 
                            value={packingSlips[tab].boxNumber}
                        />
                        <POField
                            value={packingSlips[tab].customerPO}
                            onChange={this.change_customerPO}
                        />
                        <ShippingServiceField 
                            options={ShippingServiceList}
                            onChange={this.change_shipmentService}
                            value={packingSlips[tab].shipmentService}
                        />
                    </HeadDisplay>
                }
                </DisplayItem>
                {
                    (orders || rmas) && packingSlips && 
                    <DndProvider backend={HTML5Backend}>
                            <Box my={3}>
                                <Typography variant="h5"> Available Items</Typography>
                                <ShippingItems 
                                    products={products}
                                    availableItems={this.getAvailableItems(rmas, orders, packingSlips)}
                                />
                            </Box>
                            <DisplayItem>
                            <Typography variant="h5">Packing Slip Items</Typography>
                            <ItemDropTable addItem={this.addItem}>
                                    <GenTable>
                                        <GenTableHead>
                                            <b>Product Id</b>
                                            <b>Product Name</b>
                                            <b>Quantity</b>
                                            <b></b>
                                        </GenTableHead>
                                        <GenTableBody>
                                            {
                                                packingSlips[tab].items.map((item, i) => {
                                                    if(item.productId){
                                                        const productName = products.find(product => product.productId === item.productId).productName;
                                                        return (<GenTableRow>
                                                                    <div>{item.productId}</div>
                                                                    <div>{productName}</div>
                                                                    <QuantityChange
                                                                       value={item.quantity}
                                                                       onChange={(e) => this.change_ItemQuantity(e, i)}
                                                                    />
                                                                    <div>
                                                                        <IconButton onClick={() => this.removeItem(item, i)}>
                                                                            <DeleteIcon color="secondary"/>
                                                                        </IconButton>
                                                                    </div>
                                                                </GenTableRow>
                                                        );
                                                    }
                                                   
                                                    return null;
                        
                                                })
                                            }
                                        </GenTableBody>
                                    </GenTable>
                                </ItemDropTable>
                                </DisplayItem>
                                <DisplayItem>
                                <Typography variant="h5">Customers Items Being Returned</Typography>
                                <ItemDropTable addItem={this.addReturnedItem}> 
                                <GenTable>
                                        <GenTableHead>
                                            <b>Product Id</b>
                                            <b>Product Name</b>
                                            <b>Quantity</b>
                                            <b></b>
                                        </GenTableHead>
                                        <GenTableBody>
                                            {
                                                packingSlips[tab].returnedItems.map((item, i) => {
                                                    if(item.productId){
                                                        const productName = products.find(product => product.productId === item.productId).productName;
                                                        return (<GenTableRow>
                                                                    <div>{item.productId}</div>
                                                                    <div>{productName}</div>
                                                                    <QuantityChange
                                                                       value={item.quantity}
                                                                       onChange={(e) => this.change_ReturnedItemQuantity(e, i)}
                                                                    />
                                                                    <div>
                                                                        <IconButton onClick={() => this.removeReturnedItem(item, i)}>
                                                                            <DeleteIcon color="secondary"/>
                                                                        </IconButton>
                                                                    </div>
                                                                </GenTableRow>
                                                        );
                                                    }
                                                    return null;
                                                })
                                            }
                                        </GenTableBody>
                                    </GenTable>
                                </ItemDropTable>
                                </DisplayItem>
                    </DndProvider>
                }
                { packingSlips &&  this.needPackingSlips(packingSlips) &&  
                        <SubmitButton
                            onClick={this.createPackingSlips}
                        >
                            Submit Packing Slips
                        </SubmitButton>
                }
                {
                    downloadSlips && packingSlips &&

                    <ShippingPrintSheet 
                        packingSlips={packingSlips}
                        slipIndex={this.state.downloadSlipIndex}
                        shipTo={(orders) ? orders[0].shipTo : rmas[0].shipTo}
                        orderDate={(orders) ? new Date(orders[0].orderDate) : new Date(rmas[0].RMADate)}
                        to={(orders) ? orders[0].to : rmas[0].to}
                        products={products}
                        order={(orders) ? orders[0] : null}
                        rma={(rmas) ? rmas[0] : null}
                    />
                }
            </Display>       
        );
    }
}

