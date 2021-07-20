import React from 'react';
import {SearchBar} from "../Common/Search";
import {Display, DisplayItem} from "../Common/Display";
import HeadDisplay from "../Common/HeadDisplay";
import {Message} from "../Common/Message";
import {Recent, RecentItem} from "../Common/Recent";
import {CollapseRow, GenTable, GenTableBody, GenTableHead} from "../Common/TemplateTable";
import {
    IdentifierField,
    DateField,
    ToField,
    ShippingField,
    CustomerField,
} from "../Common/Fields";
import {SubmitButton} from "../Common/Buttons";



import RMARepair from "./RMARepairs";
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import RMAItem from "./RMAItem";




export default class RMADisplay extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            to: null,
            shipTo: null,
            RMADate: null,
            items: null,
            customer: null,
            RMANumber: null,


            newRMA: false,
            message: null,
            change: false,

            rows: null,

            recentRMAs: null,
        };
    }

    componentDidMount(){
        const  state = this.props.location.state;

        if(!state) //did the router render component with a state?
        {
            this.fetchRecent();
        }
        else if(state.RMANumber) //check if the router passed a prop to the newly rendered component
        {
            this.fetchRMA(state.RMANumber);
        }
    }

    createRMA = () => {
        
        const {RMANumber, customer, RMADate, items, shipTo, to} = this.state;

        if(RMANumber && customer && RMADate){ //check if needed fields are there

            const newRMA = {    
                RMANumber: RMANumber,
                customerId: customer._id,
                items: items,
                RMADate: RMADate,
                shipTo: shipTo,
                to: to,
            };

            const headers = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRMA),
            };


            fetch("/api/rmas/create", headers)
                .then((res) => {
                    if(res.ok)
                    {
                        return res.json();
                    }
                  
                    res.json().then(err => this.setState({message:{error:true, text: err.message}}));
                    
                })
                .then((resRMA) => {
                    if(resRMA) 
                    {
                        this.itemsToRows(resRMA.items, resRMA.RMANumber);
                        this.props.updateRoot({RMANumber: resRMA.RMANumber, customer: customer});
                        this.setState({
                            items: resRMA.items,
                            customer: customer,
                            RMADate: new Date(resRMA.RMADate),
                            to: resRMA.to,
                            shipTo: resRMA.shipTo,
                            newRMA: false,
                            change: false,
                        });
                    }

                })
                .catch(err => this.setState({message: {error: true, text: "Failed to submit rma"}}));
        }
        else{ //set err message else
            this.setState({message:{
                error: true,
                text: "Required Fields - RMANumber - Customer - Date", 
            }})
        }
    }

    updateRMADetails = () => {

        const {to, shipTo, customer, RMADate, RMANumber} = this.state;

        const headers = {
            method: "PUT",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                to: to,
                shipTo: shipTo,
                customerId: customer._id,
                RMADate: RMADate,
            })
        }

        fetch("/api/rmas/updateDetails/" + RMANumber,headers)
            .then((res) => {
                if(res.ok)
                {
                    return this.setState({message: {error: false, text: "RMA successfully updated"}, change: false});
                }

                res.json().then((err) => this.setState({message: {error: true, text: err.message}}))
            })
            .catch((err) => this.setState({message: {error: true, text: err.message}}));
        
    }

    fetchRecent = () => {
        fetch("/api/rmas/recent/10")
            .then((res) => {
                if(res.ok)
                {
                    return res.json();
                }

                res.json().then((err) => this.setState({message:{error: true, text: err.message}}));

            })
            .then((rmas) => {
                if(!rmas){return;}

                this.setState({recentRMAs: rmas, 
                                RMANumber: null,
                                items: null,
                                newRMA: false,      
                });
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
                
                res.json().then(err => this.setState({message: {error: true, text: err.message}}));
            })
            .then((rma) => {

                if(!rma){return;}
        
                this.itemsToRows(rma.items, rma.RMANumber);//update rows

                this.setState({ 
                                RMANumber: rma.RMANumber,
                                customer: this.props.customers.find((customer) => customer._id === rma.customerId),
                                RMADate: new Date(rma.RMADate),
                                to: rma.to,
                                shipTo: rma.shipTo,
                                items: rma.items,
                                newRMA: false,
                });

            })
            .catch(err => this.setState({message: {error:true, text: err.message}}));
    }

    setRMA = (event, rma) =>{
        if(!rma) //if no rma passed get recent
        {
            this.fetchRecent();
        }
        else{
            this.fetchRMA(rma.RMANumber); //get rma
        }
    }

    change_RMANumber = (event) => {

        const num = parseInt(event.target.value)
        if(Number.isInteger(num)){
          this.setState({RMANumber: parseInt(num)});
        }
        else{
          this.setState({RMANUmber: null});
        }
    }
    
    change_RMATo = (event) => {
        this.setState({to: event.target.value, change: true});
    }

    change_RMAShipTo = (event) => {
        this.setState({shipTo: event.target.value, change: true});
    }

    change_RMADate = (event) => {
        this.setState({RMADateA: new Date(event.target.value), change: true})
    }

    change_RMACustomer = (event, customer) => {
        this.setState({customer: customer, change: true});
    } 


    addItem = (item) => {

        const newItem =  { 
            productId: item.product.productId,
            tests: item.tests,
            serialNumber: item.serialNumber,
            issue: item.issue,
        }; //properly format 

        this.setState((prevState) => { //update state
            const newItems = [...prevState.items, newItem];
            this.itemsToRows(newItems, prevState.RMANumber);
            return ({items : newItems}); 
        });
    }


    newRMA = () => {
        this.setState({ RMANumber: null,    //reset the state to null
                        RMADate: new Date(),
                        items: [],
                        rows: null,
                        customer: null,
                        to: null,
                        shipTo: null,
                        newRMA: true});
    }

    getOptionLabel = (option) => {
        return "" + option.RMANumber + " - " + option.customer.customerName; //render select options choices
    }

    /*
        Create table entries based on fetch data requires aysnc
          -cant move this to render because of fetch
          -need to await for response to determine how to create rows, therefore nothing will return to render
          -needed to use setState to update instead
          -may need to move this to server side with the inital order get function
          -OrderDisplay has the same problem w/ dependencies
      */
    itemsToRows = async(items, rmaNumber) => { //converts json items to table tags

        const rows = [];

        if(!items || !items.length)
        {
            return;
        }

        for(let i = 0; i < items.length; i++)
        {
            let serial;
            let product;

            if(items[i].serialNumber) //if serial exists go grab it
            {
                const response = await fetch("/api/serials/" + items[i].serialNumber )
                                        .catch((error) =>this.setState({message: {error: true, text: error.message}}));
                                                        

                if(response.ok)
                {
                    serial = await response.json();
                    product = this.props.products.find((prod) => prod.productId === serial.productId)
                }
                else{
                    const error = await response.json();
                    this.setState({message: {error: true, text: error.message}});
                }
            
            }
            else{
                product = this.props.products.find((prod) => prod.productId === items[i].productId);
            }
           

            const rmaRepair = <RMARepair //expandable component of the collapse row 
                                    new={this.state.newRMA} 
                                    tests={items[i].tests} 
                                    itemId={items[i]._id} 
                                    serialNumber={(items[i].serialNumber) ? items[i].serialNumber : null}
                                    rmaNumber={rmaNumber}
                                    updateMessage={(message) => this.setState({message: message}) }
                                />;

            const cols = [ items[i].serialNumber,  //columns of the row
                            product.productName, 
                            product.productId, 
                            (serial) ? serial.mesh : "", 
                            items[i].issue,
                        ];

            rows.push(
                <CollapseRow 
                            key={i} 
                            items={cols}                       
                            subItems={[rmaRepair]}
                />
            )
        }

        this.setState({rows: rows});
    }

    render(){
        const { recentRMAs,
                RMANumber, 
                newRMA , 
                change,
                RMADate,
                to,
                shipTo,
                customer,
                message,
                items,
                rows,

        }= this.state;

        const {customers, products, serials, rmas} = this.props;
        
        return(
            <Display>
        
                <SearchBar label="RMAs"
                            options={rmas}
                            getOptionLabel={this.getOptionLabel}
                            newOrderFunction={this.newRMA}
                            onChange={this.setRMA}    
                />

                {message && <Message error={message.error} text={message.text} clear={() => this.setState({message: null})}/> }

                {
                    recentRMAs && !RMANumber && !newRMA && 
                    <DisplayItem>
                        <Typography variant="h5">Recent RMAs</Typography>
                        <Recent>
                            {
                                recentRMAs.map((item, i) => {
                                    const customer = customers.find((c) => c._id === item.customerId);
                                    const date = new Date(item.RMADate);
            

                                    return(
                                        <Button style={{textTransform: "none"}} onClick={() => this.fetchRMA(item.RMANumber)}>
                                            <RecentItem>
                                                {[
                                                    "RMANumber " + item.RMANumber, 
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

                { (newRMA || RMANumber) && 
                    <DisplayItem>
                        <Typography variant="h5">RMA Details</Typography>
                        <HeadDisplay 
                            edit={!newRMA}
                            change={change}
                            updateHead={this.updateRMADetails}
                        >
                            <IdentifierField
                                    label="RMA Number"
                                    value={RMANumber}
                                    onChange={this.change_RMANumber}
                                    allowEdit={newRMA}
                            />
                            <CustomerField
                                    customers={customers}
                                    value={customer}
                                    onChange={this.change_RMACustomer}
                            />
                            <DateField 
                                label="Date Created" 
                                value={RMADate} 
                                onChange={this.change_RMADate}
                            />
                            <ToField 
                                value={to} 
                                onChange={this.change_RMATo}
                            />
                            <ShippingField 
                                value={shipTo} 
                                onChange={this.change_RMAShipTo}
                            />     
                        </HeadDisplay>
                    </DisplayItem>
                }   
                {
                    newRMA && 
                    <DisplayItem> 
                        <Typography variant="h5">
                            New Item
                        </Typography>
                        <RMAItem serials={serials} products={products} addItem={this.addItem}/>
                    </DisplayItem>
                }
                {
                    items && rows &&

                    <DisplayItem>
                        <Typography variant="h5">RMA Items</Typography>
                        <GenTable>
                            <GenTableHead>
                                <b>Serial Number</b>
                                <b>Product Name</b>
                                <b>Product Id</b>
                                <b>Mesh</b>
                                <b>Issue</b>
                                <b></b>
                            </GenTableHead>
                            <GenTableBody>
                                {rows}
                            </GenTableBody>
                        </GenTable>
                    </DisplayItem>
                }
                {
                    newRMA
                    &&
                    <SubmitButton 
                        onClick={this.createRMA} 
                    >
                            Submit
                    </SubmitButton>
                }

            </Display>
        );
    }
}
