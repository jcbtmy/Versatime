import React from 'react';
import {Display} from "../Common/Display";
import {SearchBar} from "../Common/Search";
import HeadDisplay from "../Common/HeadDisplay";
import { GeneralField } from '../Common/Fields';
import  Button from "@material-ui/core/Button";
import {Title} from "../Text";
import {Message} from "../Common/Message";
import TemplateTable from "../Common/TemplateTable";



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

    redirectToOrder = (orderNumber) => {

    }

    redirectToSerial = (serialNumber) => {

    }

    redirectToRma = (rmaNumber) => {
        
    }

    setCustomer = (option, customer) => {
        this.setState({customer: customer});
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
        const {customers} = this.props;
        const {customer, customerOrders, newCustomer, message} = this.state;

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
                        message && <Message error={message.error} clear={() => this.setState({message: null})}/>
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
                        customerOrders && !newCustomer &&
                        <TemplateTable 
                                tableHead={["Order Number", "Order Date", ]}
                            />
                    }

            </Display>
        );
    }
}