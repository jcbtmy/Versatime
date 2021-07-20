import React from "react";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

import {Recent, RecentItem} from "../Common/Recent";
import { Message } from "../Common/Message";
import { Display, DisplayItem } from "../Common/Display";




export default class Dashboard extends React.Component{
    constructor(props)
    {
        super(props);

        this.state = {
            recentRmas: null,
            recentOrders: null,
            recentSerials: null,

            message: null,

        }
    }

    componentDidMount(){
        this.fetchOrderRecent();
        this.fetchSerialRecent();
        this.fetchRMARecent();
    }

    fetchRMARecent = async() =>{
        fetch("/api/rmas/recent/6")
            .then((res) => {
                if(res.ok)
                {
                    return res.json();
                }

                res.json().then((err) => this.setState({message: {text: err.msg, error: true}}));
            })
            .then((rmas) => {

                if(!rmas){return;}

                this.setState({recentRmas: rmas});
            })
            .catch((err) => {
                this.setState({message: {error: true, text: err.message}});
            });
    }

    fetchOrderRecent = async() =>{
        fetch("/api/orders/recent/6")
            .then((res) => {
                if(res.ok)
                {
                    return res.json();
                }

                res.json().then((err) => this.setState({message: {error: true, text: err.msg}}));
            })
            .then((orders) => {
                
                if(!orders){return;}

                this.setState({recentOrders: orders});
            })
            .catch((err) => {
                this.setState({message: {error: true, text: err.msg}});
            });
    }

    fetchSerialRecent = async() => {
        fetch("/api/serials/recent/6")
        .then((res) => {
            if(res.ok)
            {
                return res.json();
            }

            res.json().then((err) => this.setState({message: {error: true, text: err.msg}}));
        })
        .then((serials) => {
            
            if(!serials){return;}

            this.setState({recentSerials: serials});
        })
        .catch((err) => {
            this.setState({message: {error: true, text: err.msg}});
        });
    }

    render(){

        const {recentSerials, recentOrders, recentRmas} = this.state;
        const {user, customers, products} = this.props;

        return(
            <Display>
                {user &&  <Typography variant="h5">Hello {user.username}!</Typography>}
                {   recentOrders && 
                     <DisplayItem>
                     <Typography variant="h5">Recent Orders</Typography>
                     <Recent>
                       {
                         recentOrders.map((item) => {
   
                           const customer = customers.find((c) => c._id === item.customerId);
                           const date = new Date(item.orderDate);
   
                           return (
                                   <Button style={{textTransform: "none"}} >
                                       <Link style={{textDecoration: "none"}} 
                                            to={{
                                                pathname:"/SalesOrders",
                                                state:{
                                                    orderNumber: item.orderNumber,
                                                }
                                            }}
                                       >
                                        <RecentItem>
                                                    {[  "Order: " + item.orderNumber, 
                                                        customer.customerName, 
                                                        "" + date.getMonth() + "/" + date.getDay() + "/"+ date.getFullYear(),
                                                    ]}
                                        </RecentItem>
                                        </Link>
                                   </Button>
                                
                           );
                         })
                       }
                     </Recent>
                   </DisplayItem>
                }
                {   recentRmas && 
                    <DisplayItem>
                         <Typography variant="h5">Recent RMAs</Typography>
                         <Recent>
                            {
                                recentRmas.map((item) => {
                                    const customer = customers.find((c) => c._id === item.customerId);
                                    const date = new Date(item.RMADate);
            
                                    return (
                                        <Button style={{textTransform: "none"}}>
                                            <Link style={{textDecoration: "none"}} 
                                                to={{
                                                    pathname:"/RMAs",
                                                    state:{
                                                        RMANumber: item.RMANumber,
                                                    }
                                                }}
                                            >  
                                                <RecentItem>
                                                    {[
                                                        "RMANumber " + item.RMANumber, 
                                                        customer.customerName, 
                                                        "" + date.getMonth() + "/" + date.getDay() + "/"+ date.getFullYear(),
                                                    ]}
                                                </RecentItem>                                       
                                            </Link>
                                        </Button>
                                    );
                                })
                            }
                        </Recent>
                    </DisplayItem>

                }
                {
                    recentSerials &&
                    <DisplayItem>
                        <Typography variant="h5">Recent Serials</Typography>
                        <Recent>
                            {
                                recentSerials.map((item, i) => {

                                    return(
                                        <Button style={{textTransform: "none"}} >
                                             <Link style={{textDecoration: "none"}} 
                                                to={{
                                                    pathname:"/SerialNumbers",
                                                    state:{
                                                        RMANumber: item.serialNumber,
                                                    }
                                                }}
                                            >
                                                  <RecentItem>{[
                                                    "SN: " + item.serialNumber,
                                                    customers.find((customer) => customer._id === item.customerId).customerName,
                                                    products.find((product) => product.productId ===item.productId).productName,
                                                ]}
                                                </RecentItem>
                                
                                            </Link>
                                        </Button>
                                    );
                                })
                            }
                        </Recent>
                    </DisplayItem>
                }

            </Display>
        );
    }
}