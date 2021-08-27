import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import { Title } from '../Text';
import {Message} from "../Common/Message"
import {    ProductField, 
            CustomerField, 
            QuantityField,
            RMAField,
            OrderField,
        } from "../Common/Fields";

import {serialXML, getDymoLabel, getDymoPrinter} from "./SerialDymoXML";

const useStyles = makeStyles(() => ({
    root : {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        marginTop: 15,
        gap: 15,
    },

    childFlex : {
        display:"flex",
        gap: 15
    },
    button : {
        alignSelf: "flex-start"
    }
}));

class Newserial extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            quantity: null,
            product: null,
            customer: null,
            order: null,
            rma: null,
            error: null,
            updated: null,
        };
    }

    printSerial = (serialNumber) =>{

        const dymo = window.dymo;

        const printerName = getDymoPrinter(dymo);

        if(!printerName)
        {
            this.setState({updated: {error: true,
                                    text: "No Printer Found"}});
            return;
        }

        const label = getDymoLabel(dymo, serialXML);

        if(!label)
        {
            this.setState({updated: {error: true,
                                    text: "Could not create label"}});
            return;
        }

        label.setObjectText("BARCODE", serialNumber);
        label.print(printerName);
    }

    setQuantity = (event) =>{ 
        this.setState({quantity: parseInt(event.target.value)});
    }

    setCustomer = (event, customer) => {
        this.setState({customer: customer});
    }

    setProduct = (event, product) => {
        this.setState({product: product});
    }
    
    setOrder = (event, order) => {

        if(order && order.orderNumber){
            this.setState({order: order.orderNumber});
        }
        else{
            this.setState({order: order});
        }

    }

    setRMA = (event, rma) => {
        if(rma && rma.RMANumber){
            this.setState({rma:  rma.RMANumber});
        }
        else{
            this.setState({rma: rma});
        }
    }
    createSerials = () => {
        const {quantity, product, order, rma,customer } = this.state;

        if(quantity && customer && product)
        {
            const newSerial = { customerId: customer._id, 
                                quantity: quantity, 
                                productId: product.productId,
                                RMANumber: rma,
                                orderNumber: order,
                            };

            const headers = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSerial),
            };

            fetch("/api/serials/create", headers)
                .then((res) => {
                        if(res.ok){
                            return res.json();
                        }
                        else{
                            res.json().then((error) => this.setState({updated: {error: error.msg}}));
                        }
                })
                .then((serials) => { 
                    this.setState({updated: true});

                    for(let i = 0; i < serials.length; i++)
                    {
                        const serial = serials[i];
                        serial.customer = customer;
                        this.props.updateRoot(serial);
                        this.printSerial(serial.serialNumber);
                    }
                })
                .catch((error) => this.setState({updated : {error: error.toString()}}));
        }
        else{

        }
    }

    render(){

        const {quantity, product, order, rma,customer, updated} = this.state;
        const {customers, products, classes, orders, rmas} = this.props;

        return(
            <div>
                <Title>
                    New Serials
                </Title>
                {updated && <Message error={updated.error} clear={() => this.setState({updated: null})}/>}
                <Paper className={classes.root} elevation={1}>
                    <div className={classes.childFlex}>
                        <CustomerField customers={customers} value={customer} onChange={this.setCustomer} edit/>
                        <ProductField products={products} value={product} onChange={this.setProduct} edit/>
                    </div>
                    <div className={classes.childFlex}>
                        <OrderField edit orders={orders} value={{orderNumber: order}} onChange={this.setOrder}/>
                        <RMAField   edit rmas={rmas} value={{RMANumber: rma}} onChange={this.setRMA}/>
                    </div>
                    <div className={classes.childFlex}>
                        <QuantityField value={quantity} onChange={this.setQuantity}/>
                    </div>
                    <Button onClick={this.createSerials}className={classes.button} variant="contained" color="primary">
                        Create    
                    </Button>   
                </Paper>
            </div>
        );
    }
}

export default function NewSerial(props){
    const classes = useStyles();

    return <Newserial classes={classes} {...props} />
}
