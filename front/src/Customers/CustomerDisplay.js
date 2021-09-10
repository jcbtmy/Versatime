import React from 'react';
import {Display} from "../Common/Display";
import {SearchBar} from "../Common/Search";
import HeadDisplay from "../Common/HeadDisplay";
import { GeneralField } from '../Common/Fields';
import  Button from "@material-ui/core/Button";
import {Title} from "../Text";
import {Message} from "../Common/Message";
import {GenTable, GenTableBody, GenTableHead, GenTableRow} from "../Common/TemplateTable";
import { Typography } from '@material-ui/core';



export default class CustomerDisplay extends React.Component{
    
    constructor(props)
    {
        super(props);
        this.state = {
            customer: null,
            customerOrders: null,
            customerRmas: null,
            customerSerials: null,
            newCustomer: false,
            message: null,
        };
    }

    componentDidMount()
    {
        const  locationArr = window.location.pathname.split('/');
        
        if(locationArr.length === 3 && locationArr[2] !== '')
        {
            const customer = this.props.customers.find((c) => c._id === locationArr[2]);
            this.setState({customer: customer})
            this.fetchCustomerSerials(locationArr[2]);
            return;
        }
    }

    getOptionLabel = (option) => {
        return option.customerName;
    }

    updateCustomerName = (event) => {
        this.setState((prevState) => ({
            customer: {
                ...prevState.customer,
                customerName: event.target.value,
            }
        }));
    }

    updateCustomer = () => {

        const headers = {
            method: "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({customerName: this.state.customer.customerName}),
        };


        fetch("/api/customers/" + this.state.customer._id, headers)
        .then((res) => {
            if(res.ok)
            {
                return res.json();
            }
            res.json().then((err) => this.setState({message: {error: true, text: err.message}}));
        })
        .then((customerUpdated) => {

            if(!customerUpdated)
                return;
                
            this.setState((prevState) => ({
                customer: {
                    ...prevState.customer,
                    customerName: customerUpdated.customerName,
                }
            }));
        })
        .catch((err) => this.setState({message: {error: true, text: err.message}}))
    }

    fetchCustomerSerials = (customerId) => {

        window.history.replaceState(null, "Versatime", "/Customers/" + customerId)

        fetch("/api/serials/customerId/" + customerId)
            .then((res) => {
                if(res.ok)
                {
                    return res.json();
                }

                res.json().then((err) => this.setState({
                    message: {
                        error: true,
                        text: err.message,
                    }
                }))
            })
            .then((serials) => {
                if(serials)
                {
                    this.setState({customerSerials: serials});
                }
            })
            .catch((err) => this.setState({
                message : {
                    error: true,
                    text: err.message,
                }
            }));

    }

    redirectToOrder = (orderNumber) => {

    }

    redirectToSerial = (serialNumber) => {

    }

    redirectToRma = (rmaNumber) => {
        
    }

    deleteCustomer = () => {

        const url = "/api/customers/" + this.state.customer._id;
        const headers = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
        };

        fetch(url, headers)
            .then((res) => {
                if(res.ok) 
                {
                    return this.setState({
                        message: {error: false, text: "Successfully deleted"}, 
                        customer: null, 
                        customerSerials: null
                    });
                }
                res.json().then(err => this.setState({message: { error: true, text: err.message}}));
            })
            .catch(err => this.setState({message: {error: true, text: err.message}}));
    }

    setCustomer = (option, customer) => {

        this.setState({customer: customer});
        
        if(customer)
        {
            this.fetchCustomerSerials(customer._id);
        }
        else{
            this.setState({
                customer: null,
                customerSerials: null,
                customerOrders: null,
                customerRmas: null,
            });
        }
    }

    newCustomer = () => {
        this.setState({newCustomer: true, customer: { customerName: ""} });
    }

    createNewCustomer = () => {

        const customer = this.state.customer;
        
        if(customer.customerName){
            const headers = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({customerName: customer.customerName}),
            };

            fetch("/api/customers/create", headers)
                .then((res) => {
                        if(res.ok){
                            return res.json();
                        }
                        else{
                            res.json().then((error) => this.setState({message: {error: error.msg}}));
                        }
                })
                .then((customer) => {
                        if(customer){
                            this.setState({customer: customer, message: {error:null}, newCustomer: false});
                            this.props.onUpdate(customer);
                         }
                })
                .catch((error) => this.setState({message : {error: error.toString()}}));
        }
    }


    render()
    {
        const {customers, products} = this.props;
        const {customer, customerSerials, newCustomer, message} = this.state;

        return(
            <Display>

                    <SearchBar  label="Customers"
                                options={customers}
                                getOptionLabel={this.getOptionLabel}
                                newOrderFunction={this.newCustomer}
                                onChange={this.setCustomer}    
                    />
                    {
                        newCustomer && <Title variant="h5">New Customer</Title>
                    }
                    {
                        message && <Message error={message.error} text={message.text} clear={() => this.setState({message: null})}/>
                    }
                    {
                        customer && 
                        <HeadDisplay edit={!newCustomer}>
                            <></>
                            <GeneralField label="Customer Name" value={customer.customerName} onChange={this.updateCustomerName}/>
                        </HeadDisplay>
                    }
                    {
                        newCustomer &&  <Button style={{width: "auto"}} color="primary" onClick={this.createNewCustomer}>Submit</Button>
                    }
                    {
                        customerSerials && !newCustomer && 

                            <GenTable>
                                <GenTableHead>
                                    <b>Serial Number</b>
                                    <b>Product Name</b>
                                    <b>Product Id</b>
                                </GenTableHead>
                                <GenTableBody>
                                    {
                                        customerSerials.map((serial) => {
                                            const product = products.find((p) =>  p.productId === serial.productId );

                                            return(
                                                <GenTableRow>
                                                    <Typography>{serial.serialNumber}</Typography>
                                                    <Typography>{product && product.productName}</Typography>
                                                    <Typography>{product && product.productId}</Typography>
                                                </GenTableRow>
                                            )
                                        })
                                    }
                                </GenTableBody>
                            </GenTable>

                    }

                    {
                        customer && !newCustomer && customerSerials && !customerSerials.length && this.props.user.role === 0 &&
                        <Button color="secondary" variant="contained" style={{width: "auto", marginRight: "auto"}}>Delete Customer</Button>
                    }

            </Display>
        );
    }
}