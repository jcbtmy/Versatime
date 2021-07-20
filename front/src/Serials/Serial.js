import React from 'react';
import TemplateTable, {Row}from "../Common/TemplateTable";
import HeadDisplay from "../Common/HeadDisplay";
import NewAction from "./NewAction";
import { Typography } from '@material-ui/core';
import {Message} from "../Common/Message";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {serialXML, serialMeshXML, serialBluetoothMeshXML,getDymoLabel, getDymoPrinter} from "./SerialDymoXML";

import {
        IdentifierField,
        MeshField,
        CustomerField,
        DateField,
        BluetoothField,
        ProductField,
        VersionField,

} from "../Common/Fields";


const dateString = (date) => {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    return month + "-" + day + "-" + year;
}


export default class Serial extends React.Component{

    constructor(props)
    {
        super(props);

        this.state = {
            serial: null,
            change: false,
            updated: null,
            mesh: "",
        };

        this.serialHead = [
            "Action",
            "Date",
            "Author",
            "RMA",
            "Order",
            "Notes",
        ];
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps != this.props){
            this.fetchSerial(this.props.serial.serialNumber);
        }
    }

    componentDidMount(){
        this.fetchSerial(this.props.serial.serialNumber);
    }

    printSerial = () =>{

        const dymo = window.dymo;

        const printerName = getDymoPrinter(dymo);

        if(!printerName)
        {
            this.setState({updated: {error: "No Printer Found"}});
            return;
        }

        const label = getDymoLabel(dymo, serialXML);

        if(!label)
        {
            this.setState({updated: {error: "Could not create label"}});
            return;
        }

        label.setObjectText("BARCODE", this.state.serial.serialNumber);
        label.print(printerName);
    }

    printSerialDetails = () => {

        const mesh = this.state.serial.mesh;
        const bluetooth = this.state.serial.bluetooth;
        const dymo = window.dymo;
        const printerName = getDymoPrinter(dymo);

        if(!printerName)
        {
            this.setState({updated: {error: "No Printer Found"}});
            return;
        }
        if(mesh && bluetooth)
        {
            const label = getDymoLabel(dymo, serialBluetoothMeshXML(mesh));

            if(!label)
            {
                this.setState({updated: {error: "Could not create label"}});
                return;
            }
            label.print(printerName);
        }
        else if(mesh)
        {
            const label = getDymoLabel(dymo, serialMeshXML(mesh));

            if(!label)
            {
                this.setState({updated: {error: "Could not create label"}});
                return;
            }
            label.print(printerName);
        }
        else{
            this.setState({updated: {error: "No mesh or bluetooth set"}});
        }
    }

    fetchSerial = async(serialNumber) => {

        fetch("/api/serials/" + serialNumber)
            .then((res) => {    
                    if(res.ok)
                    {
                        return res.json()
                    }
                    else{
                        res.json().then((error) => this.setState({updated: {error: error.msg}}));
                    }
            })
            .then((serial) => {
                if(serial){

                    serial.product = this.props.products.find((product) => {
                        if(product.productId === serial.productId){
                            return product;
                        }
                    });

                    serial.customer = this.props.customers.find((customer) => {
                        if(customer._id === serial.customerId)
                        {
                            return customer;
                        }
                    });

                    serial.warrantyExprDate = (serial.warrantyExprDate) ? new Date(serial.warrantyExprDate) : null;

                    this.setState({serial: serial});
                }

            })
            .catch(err => this.setState({update: {error: err.msg}}));
    } 


    historyToRows(serialHistory){
        
        const items = serialHistory.map((entry) => {
                                            if(entry.action === "Tested"){
                                                entry.action = <div style={{color: "green"}}>{entry.action}</div>
                                            }
                                            else if( entry.action === "Shipped")
                                            {
                                                entry.action = <div style={{color: "blue"}}>{entry.action}</div>
                                            }
                                            else if( entry.action === "RMA"){
                                                entry.action = <div style={{color: "purple"}}>{entry.action}</div>
                                            }
                                            return <Row items={[   entry.action, 
                                                        dateString( new Date(entry.date)), 
                                                        entry.author,
                                                        entry.RMANumber,
                                                        entry.orderNumber,
                                                        entry.note,
                                                    ]}/>;
                                        });                        
        return items;

    }

    ///Need to change this field obj for production
    setCustomer = (event, customer) => {
        this.setState((prevstate) => ({ serial : { ...prevstate.serial, customer: customer }, change: true}));
    }

    setProduct = (event, product) => {
        this.setState((prevstate) => ({ serial : { ...prevstate.serial, product: product }, change: true}));
    }

    setExprDate = (event) => {
        this.setState((prevstate) => ({ serial : { ...prevstate.serial, warrantyExprDate: new Date(event.target.value)}, change: true}));
    }

    setBluetooth = (event) => {
        this.setState((prevstate) => ({ serial : { ...prevstate.serial, bluetooth: event.target.value }, change: true}));
    }

    setMesh = (event) => {
        this.setState((prevstate) => ({ serial : { ...prevstate.serial, mesh: event.target.value }, change: true}));
    }

    setVersion = (event) => {
        this.setState((prevstate) => ({ serial : { ...prevstate.serial, version: event.target.value }, change: true}));
    }

    addHistory = (action) => {

        const headers = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action),
        };

        fetch("/api/serials/addHistory/" + this.state.serial.serialNumber, headers)
            .then((res) => {
                    if(res.ok){
                        return res.json();
                    }
                    else{
                        res.json().then((error) => this.setState({updated: {error: error.msg}}));
                    }
             })
            .then((res) =>{
                if(res)
                {
                    this.setState((prevstate) => 
                    ({serial: {...prevstate.serial, history: res.history}, updated: true}));
                }
            })
            .catch((err) => this.setState({updated: {error: err.msg}}));
    }


    updateHead = (event) => {

        const serial = this.state.serial;

        const serialObj = {
            customerId: serial.customer._id,
            productId: serial.product.productId,
            version: serial.version,
            bluetooth: serial.bluetooth,
            mesh: serial.mesh,
            warrantyExprDate: (serial.warrantyExprDate) ? serial.warrantyExprDate : null ,
        }

        const headers = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serialObj),
        };

        fetch("/api/serials/update/" + this.state.serial._id, headers)
            .then( (res) => {
                if(res.ok)
                {
                    return res.json();
                }
                else{
                    res.json().then((err) => this.setState({updated: {error : err.msg}}));
                }
            })
            .then((res) => {
                if(res){
                    this.setState({updated: true, change: false});
                }
            })
            .catch((err) => {
                this.setState({updated: {error: err.msg}});
            });
        
    }

    render()
    {
        const {customers, products, orders, rmas} = this.props;
        const {serial, change, updated} = this.state;

        return(
            <div>
                <Typography variant="h5">
                    Serial Details
                </Typography>
                {updated && <Message error={updated.error} text={updated.error} clear={() => this.setState({updated: null})}/>}
                {serial &&
                    <>
                    <Box display="flex" style={{gap: 15, margin: "15px 0px 15px 0px"}}>
                        <Button color="primary" variant="contained" onClick={this.printSerialDetails}>Print Details Label</Button>
                        <Button color="primary" variant="contained" onClick={this.printSerial}>Print Serial Number</Button>
                    </Box>
                    <HeadDisplay edit={this.props.edit} updateHead={this.updateHead} change={change}>
                        <IdentifierField label="Serial Number" value={serial.serialNumber}  /> 
                        <CustomerField  customers={customers} value={serial.customer} onChange={this.setCustomer}/>
                        <MeshField      value={serial.mesh} onChange={this.setMesh}/>
                        <BluetoothField value={serial.bluetooth} onChange={this.setBluetooth}/>
                        <ProductField   products={products} value={serial.product} onChange={this.setProduct}/>
                        <VersionField   value={serial.version}  onChange={this.setVersion}/>
                    </HeadDisplay>
                    <div style={{marginTop: 30, width: "100%"}}></div>
                    <NewAction orders={orders} rmas={rmas} addHistory={this.addHistory}/>
                    <Typography variant="h5">
                        Action History
                    </Typography>
                    <TemplateTable  tableHead={this.serialHead}
                                    rows={this.historyToRows(serial.history)}
                    />
                    </>
                 }
            </div>
        );
    }
}
