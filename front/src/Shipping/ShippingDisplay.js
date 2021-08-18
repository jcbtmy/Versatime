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
            
            order: null,
            rma: null,
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
                orderNumber:        packingSlips[i].orderNumber,
                RMANumber:          packingSlips[i].RMANumber,
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
                        const pSlips = prevState.packingSlips;
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

                        if(packingSlips[0].RMANumber) //if rma then go grab the rma for it
                        {
                            this.fetchRMA(packingSlips[0].RMANumber);
                        }
                        else{
                            this.setState({rma: null});
                        }

                        if(packingSlips[0].orderNumber) //if orderr then go grab order for it
                        {
                            this.fetchOrder(packingSlips[0].orderNumber);
                        }
                        else{
                            this.setState({order: null});
                        }
                }
                else{

                    //if no packing slips are made for order, go grab the correct (order | rma) to get items, info etc
                    if(searchObject.type === "Order")
                    {
                        this.fetchOrder(searchObject.id);
                        this.setState({rma: null});
                    }

                    if(searchObject.type === "RMA")
                    {
                        this.fetchRMA(searchObject.id);
                        this.setState({order: null});
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
                        RMANumber:          (searchObject.type === "RMA") ? searchObject.id : null,
                        orderNumber:        (searchObject.type === "Order") ? searchObject.id : null,
                    });
                }


                this.setState({
                    packingSlips:       packingSlips, 
                    tab:                0,
                });

            })
            .catch((err) => this.setState({message: {error: true, text: err.message}}));
    }

    fetchOrder = (orderNumber) => {

        fetch("/api/orders/" + orderNumber )
            .then((res) => {
                
                if(res.ok)
                {
                    return res.json();
                }
                
                res.json().then((err) => this.setState({ message: {error: true,  text: err.message} }));

            })
            .then((order) => {

                if(!order){return}

                this.setState({order: order});
            })
            .catch((err) => this.setState({message: {error: true, text: err.message}}));

    }

    
    fetchRMA = (RMANumber) => {

        fetch("/api/rmas/" + RMANumber)
            .then((res) => {

                if(res.ok)
                {
                    return res.json();
                }

                res.json().then((err) => this.setState({message: {error: true, text: err.message} }));
            })
            .then((rma) => {
                if(!rma){return;}

                this.setState({rma: rma});
            })
            .catch((err) => this.setState({message: {error: true, text: err.message} }));

    }

    getAvailableItems(rma, order, packingSlips)
    {
        //get all available items from orders, rmas, and remove all items from the packing slips
        const avaiableItems = [];

        if(order){
            order.items.forEach(
            (item) => { //get order items
                avaiableItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                });
            });
        }

        if(rma && rma.items){ //get rma items
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
                orderNumber:        (prevState.order) ? prevState.order.orderNumber : null,
                RMANumber:          (prevState.rma) ? prevState.rma.RMANumber : null,
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
                orderNumber:        packingSlips[i].orderNumber,
                RMANumber:          packingSlips[i].RMANumber,
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

    change_RMA = (event, rma) => {

        this.setState((prevState) => {

            const slips = prevState.packingSlips;
            //change rma for all slips
        
            for(let i = 0; i < slips.length; i++)
            {
                slips[i].RMANumber = (rma) ? rma.RMANumber: null;
            }
            return {packingSlips: slips};
        });

        if(rma){ //if not rma go get it
            this.fetchRMA(rma.RMANumber);
        }
        else{
            this.setState({rma: null});
        }
    }

    change_Order = (event, order) => {
        //change order for all slips

        this.setState((prevState) => {

            const slips = prevState.packingSlips;
        
            for(let i = 0; i < slips.length; i++)
            {
                slips[i].orderNumber = (order) ? order.orderNumber: null;
            }
            return {packingSlips: slips};
        });

        if(order){ //if theres not an order then go get it
            this.fetchOrder(order.orderNumber);
        }
        else{
            this.setState({order: null});
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
        const {products, orders, rmas} = this.props;
        const { 
                newShipment,
                packingSlips,
                options, 
                order, 
                rma , 
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
                    (order || rma) && packingSlips && 
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
                            value={(order)}
                            orders={orders}
                            onChange={this.change_Order}    
                        />
                        <RMAField
                            value={(rma)}
                            rmas={rmas}
                            onChange={this.change_RMA}
                        />
                        <ToField
                            value={(order) ? order.to : rma.to}
                            noEdit={true}
                        />
                        <ShippingField
                            value={(order) ? order.shipTo: rma.shipTo}
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
                    (order || rma) && packingSlips && 
                    <DndProvider backend={HTML5Backend}>
                            <Box my={3}>
                                <Typography variant="h5"> Available Items</Typography>
                                <ShippingItems 
                                    products={products}
                                    availableItems={this.getAvailableItems(rma, order, packingSlips)}
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
                        shipTo={(order) ? order.shipTo : rma.shipTo}
                        orderDate={(order) ? new Date(order.orderDate) : new Date(rma.RMADate)}
                        to={(order) ? order.to : rma.to}
                        products={products}
                        order={order}
                        rma={rma}
                    />
                }
            </Display>       
        );
    }
}

