
import React from "react";
import {Title} from "../Text";
import {SearchBar} from "../Common/Search";
import {Recent, RecentItem} from "../Common/Recent";
import {Display, DisplayItem} from "../Common/Display";
import NewSerial from "./NewSerial";
import HeadDisplay from "../Common/HeadDisplay";
import {Message} from "../Common/Message";
import NewAction from "./NewAction";
import {
    IdentifierField,
    MeshField,
    CustomerField,
    BluetoothField,
    ProductField,
    VersionField,

} from "../Common/Fields";
import {GenTable, GenTableBody, GenTableHead, Row} from "../Common/TemplateTable";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import dateString from "../Common/DateString";
import {serialXML, serialMeshXML, serialBluetoothMeshXML,getDymoLabel, getDymoPrinter} from "./SerialDymoXML";

export default class SerialDisplay extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            serial: null,
            data : null,
            newSerial: false,
            recentSerials: null,
            message:null,
            change: false,
        };
    }

    componentDidMount(){
        
        const  state = this.props.location.state;

        if(!state) //did the router render component with a state?
        {
          this.fetchRecent();
        }
        else if(state.serialNumber) //check if the router passed a prop to the newly rendered component
        {
          this.fetchSerial(state.serialNumber);
        }

    }

    printSerial = () =>{

        const dymo = window.dymo;

        const printerName = getDymoPrinter(dymo);

        if(!printerName)
        {
            this.setState({message: {error: true,
                                    text: "No Printer Found"}});
            return;
        }

        const label = getDymoLabel(dymo, serialXML);

        if(!label)
        {
            this.setState({message: {error: true,
                                    text: "Could not create label"}});
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
            this.setState({message: {error: true,
                                     text: "No Printer Found",
                                    }});
            return;
        }
        if(mesh && bluetooth)
        {
            const label = getDymoLabel(dymo, serialBluetoothMeshXML(mesh));

            if(!label)
            {
                this.setState({message: {
                                        error: true,
                                        text:  "Could not create label",}
                               });
                return;
            }
            label.print(printerName);
        }
        else if(mesh)
        {
            const label = getDymoLabel(dymo, serialMeshXML(mesh));

            if(!label)
            {
                this.setState({message: {
                                            error: true,
                                            text: "Could not create label",
                                }});
                return;
            }
            label.print(printerName);
        }
        else{
            this.setState({message: {
                                        error: true,
                                        text: "No mesh or bluetooth set",
                                    }});
        }
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
                                            return <Row items={[   
                                                        entry.action, 
                                                        dateString( new Date(entry.date)), 
                                                        entry.author,
                                                        entry.RMANumber,
                                                        entry.orderNumber,
                                                        entry.note,
                                                    ]}/>;
                                        });                        
        return items;

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
                        res.json().then((error) => this.setState({message: {error: true, text:  error.message}}));
                    }
             })
            .then((res) =>{
                if(res)
                {
                    this.setState((prevstate) => 
                    ({serial: {...prevstate.serial, history: res.history}, message: {error: false, text: "Successfully added to history"}}));
                }
            })
            .catch((err) => this.setState({message: {error: true, text: err.message}}));
    }

    updateHead = (event) => {

        const serial = this.state.serial;

        const serialObj = {
            customerId: serial.customer._id,
            productId: serial.product.productId,
            version: serial.version,
            bluetooth: serial.bluetooth,
            mesh: serial.mesh,
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
                    res.json().then((err) => this.setState({message: {  error : true,
                                                                        text: err.message
                                                            }}));
                }
            })
            .then((res) => {
                if(res){
                    this.setState({message: {error: false, text: "Successfuly updated serial"}, change: false});
                }
            })
            .catch((err) => {
                this.setState({message: {error: true,
                                        text: err.message}});
            });
        
    }

    fetchSerial = async(serialNumber) => {

        fetch("/api/serials/" + serialNumber)
            .then((res) => {    
                    if(res.ok)
                    {
                        return res.json();
                    }
                    else{
                        res.json().then((error) => this.setState({message: {error:true, text: error.message}}));
                    }
            })
            .then((serial) => {
                if(serial){

                    serial.product = this.props.products.find((product) => product.productId === serial.productId);

                    serial.customer = this.props.customers.find((customer) => customer._id === serial.customerId);

                    this.setState({serial: serial});
                }

            })
            .catch(err => this.setState({
                            message: { 
                                error:true,
                                text: err.message
                            }
                        }));
    } 



    fetchRecent = () => {
        fetch("/api/serials/recent/6")
            .then((res) => {
                if(res.ok)
                {
                    return res.json();
                }
                
                res.json().then((err) => this.setState({
                    message: {
                        text: err.message,
                        error: true,
                    }
                }));
                
            })
            .then((serials) => {   
                if(!serials){return;}
                this.setState({recentSerials: serials});
            })
            .catch((err) => {
                this.setState({message: {
                    error: true,
                    text: err.message,
                }})
            })
    }
    setCustomer = (event, customer) => {
        this.setState((prevstate) => ({ serial : { 
                                            ...prevstate.serial, 
                                            customer: customer 
                                        }, 
                                        change: true}));
    }

    setProduct = (event, product) => {
        this.setState((prevstate) => ({ serial : { ...prevstate.serial, product: product }, change: true}));
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

    setSerial = (event, value) => {        
        if(!value)
        {
            this.fetchRecent();
        }
        else{
            this.fetchSerial(value.serialNumber);
        }

        this.setState({newSerial: false});
    }

    newSerial = () => {
        this.setState({serial: null, newSerial: true, recentSerials: null });
    }

    getOptionLabel = (option) => {
        return "" +  option.serialNumber + " - " + option.customer.customerName;
    }

    render(){
        const { serial,   
                newSerial, 
                recentSerials, 
                message,
                change
               } = this.state;

        const {customers, serials, products, orders, rmas} = this.props;

        return(
            <Display>
                <SearchBar  label="Serial Numbers"
                            options={serials}
                            getOptionLabel={this.getOptionLabel}
                            newOrderFunction={this.newSerial}
                            onChange={this.setSerial}    
                />
                {
                    message && 
                    <Message 
                        text={message.text} 
                        error={message.error} 
                        clear={() => this.setState({message: null})}
                    />
                }
                {
                    !serial && !newSerial && recentSerials &&

                    <DisplayItem>
                        <Title variant="h5">
                            Recent Serials
                        </Title>
                        <Recent>
                            {
                                recentSerials.map((entry) => {
                                    return (
                                        <Button style={{textTransform: "none"}} onClick={(e) => this.setSerial(e, entry)}>
                                            <RecentItem>{[
                                                "SN: " + entry.serialNumber,
                                                customers.find((customer) => customer._id === entry.customerId).customerName,
                                                products.find((product) => product.productId === entry.productId).productName,
                                            ]}
                                        </RecentItem>
                                        </Button>
                                    );
                                })
                            }
                        </Recent>

                    </DisplayItem>

                }
                {  serial && 
                    <DisplayItem>
                        <Typography variant="h5">Serial Details</Typography>
                        <Box display="flex" style={{gap: 15, margin: "7px 0px 7px 0px"}}>
                            <Button color="primary" variant="contained" onClick={this.printSerialDetails}>Print Details Label</Button>
                            <Button color="primary" variant="contained" onClick={this.printSerial}>Print Serial Number</Button>
                        </Box>
                        <HeadDisplay edit={!newSerial} updateHead={this.updateHead} change={change}>
                            <IdentifierField 
                                label="Serial Number" 
                                value={serial.serialNumber}  
                            /> 
                            <CustomerField  
                                customers={customers} 
                                value={serial.customer} 
                                onChange={this.setCustomer}
                            />
                            <MeshField      
                                value={serial.mesh} 
                                onChange={this.setMesh}
                            />
                            <BluetoothField 
                                value={serial.bluetooth} 
                                onChange={this.setBluetooth}
                            />
                            <ProductField   
                                products={products} 
                                value={serial.product} 
                                onChange={this.setProduct}
                            />
                            <VersionField   
                                value={serial.version}  
                                onChange={this.setVersion}
                            />
                        </HeadDisplay>
                    </DisplayItem>
                }
                {
                    serial &&
                    <DisplayItem>
                        <NewAction orders={orders} rmas={rmas} addHistory={this.addHistory}/>
                    </DisplayItem>
                }
                {
                    serial && 

                    <DisplayItem>
                        <Typography variant="h5">Serial History</Typography>
                        <GenTable>
                            <GenTableHead>
                                <b>Action</b>
                                <b>Date</b>
                                <b>Author</b>
                                <b>RMA</b>
                                <b>Order</b>
                                <b>Notes</b>
                            </GenTableHead>
                            <GenTableBody>
                                {this.historyToRows(serial.history)}
                            </GenTableBody>
                        </GenTable>
                    </DisplayItem>

                } 
                {

                    newSerial
                    &&
                    <DisplayItem>
                        <NewSerial  customers={customers}
                                    products={products}
                                    rmas={rmas}
                                    orders={orders}
                                    updateRoot={this.props.updateRoot}
                        />
                    </DisplayItem>
                }
            </Display>
        );

    }
};


