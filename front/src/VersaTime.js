import React, { Suspense } from 'react';
import { NavBar, MenuBar } from "./NavBar";
import { Box, Typography } from "@material-ui/core";
import AssignmentIcon from '@material-ui/icons/Assignment';
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import BuildIcon from '@material-ui/icons/Build';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import GroupIcon from '@material-ui/icons/Group';
import {Root, DisplayContainer, Page} from "./Common/Display";
import Dashboard  from './Dashboard/Dashboard';
import CircularProgress from '@material-ui/core/CircularProgress';



import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


const OrdersDisplay = React.lazy(() => import("./Orders/OrdersDisplay"));
const SerialDisplay = React.lazy(() => import("./Serials/SerialsDisplay"));
const RMADisplay = React.lazy(() => import("./RMA/RMADisplay"));
const ShippingDisplay = React.lazy(() => import("./Shipping/ShippingDisplay"));
const CustomerDisplay = React.lazy(() => import("./Customers/CustomerDisplay"));
const AddUser  = React.lazy(() => import("./User/AddUser"));

const Routes = [
  { path: "/SalesOrders", text: "Sales Orders", icon: <AssignmentIcon fontSize="large" /> },
  { path: "/SerialNumbers", text: "Serial Numbers", icon: <DevicesOtherIcon fontSize="large" /> },
  { path: "/RMAs", text: "RMA", icon: <BuildIcon fontSize="large" /> },
  { path: "/Shipping", text: "Shipping", icon: <LocalShippingIcon fontSize="large" /> },
  { path: "/Customers", text: "Customers", icon: <GroupIcon fontSize="large" /> },
];


export default class VersaApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      customers : null,
      products: null,
      orders: null,
      serials: null,
      rmas: null,
      user: null,

      menuOpen: true,

      error: null,
    };

  }

  componentDidMount() {
    this.getUser();
    this.fetchCustomers();
    this.fetchProducts();
    this.fetchOrders();
    this.fetchSerials();
    this.fetchRMAs();
  }


  updateCustomers = (customer) => {
      this.setState((prevState) => ({customers: [...prevState.customers, customer] }));
  }

  updateOrders = (order) => {
      this.setState((prevState) =>({orders: [...prevState.orders, order]}));
  }

  updateRMA = (rma) => {
      this.setState((prevState) => ({rmas: [...prevState.rmas, rma]}));
  }

  updateSerials = (serial) => {
      this.setState((prevState) => ({serials: [...prevState.serials, serial]}));
  }

  getUser = () => {
     fetch("/user/userInfo")
      .then((res) => {
        if(res.ok)
        {
          return res.json();
        }

        console.log(res);
      })
      .then((user) => {
        if(!user){return;}

        this.setState({user: user});
      })
      .catch((error) => console.log(error.toString()));
  }

  fetchRMAs = async() => {

      fetch("/api/rmas")
        .then((res) => {
            if(res.ok)
            {
              return res.json();
            }
            else{
              this.setState({error: {message: "Error Loading RMAs"}});
            }
        })
        .then((res) => this.setState({rmas: res}))
        .catch( error => this.setState({error}))

  }
  fetchCustomers = async () => {
  
    fetch("/api/customers")
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
        else{
            this.setState({ error: {message: "Error Loading Customers"}});
        }
      })
      .then(customers => this.setState({customers: customers}))
      .catch(error => this.setState({ error }));
  }

  fetchProducts = async () => {
   
    fetch("/api/products")
    .then( res => {
        if (res.status === 200) {
          return res.json();
        }
        else{
          this.setState({ error: {message: "Error Loading Products"}});
        }
      })
    .then(products => this.setState({products: products}))
    .catch(error => this.setState({error}));
  }


  fetchOrders = async () => {
    fetch("/api/orders")
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
        else{
          this.setState({error: {message: "Error Loading Orders"}})
        }
      })
      .then( orders => this.setState({orders: orders}))
      .catch(error => this.setState({error}));
  }

  fetchSerials = async () => {
    fetch("/api/serials")
      .then(res => {
        if(res.status === 200)
        {
          return res.json();
        }
        else{
          this.setState("Error Loading Serials");
        }
      })
      .then( serials => this.setState({serials: serials}))
      .catch(error => this.setState({error}));
  }

  handleMenuButton = () => {
    this.setState((prevState) => ({ menuOpen: !prevState.menuOpen }));
  }

  render() {
    
    const { menuOpen,
            customers, 
            error, 
            products, 
            orders,
            serials,
            user,
            rmas,

    } = this.state;

    return (
      <Router>
        <Root>
          <NavBar handleMenuButton={this.handleMenuButton} />
          <MenuBar isOpen={menuOpen} routes={Routes} />
          <Suspense fallback={<div>Loading</div>}>
            <Switch>
              <Page>
                  { (!customers || !serials || !orders || !products || !rmas || !user) && 

                    <Box display="flex" flexDirection="column" 
                      style={{marginLeft: "auto", marginRight: "auto", marginTop: 150, alignItems: "center", gap: 20}}
                    >
                      <Typography>Loading</Typography>
                      <CircularProgress size={150}/>
                    </Box>
                  }
                <DisplayContainer>
                  {error && <div style={{paddingTop: 200}}>{error.message}</div>}
                  {customers && serials && orders && products && rmas && user &&  
                      <>
                      <Route exact path="/" >
                          <Dashboard  user={user}
                                      customers={customers}
                                      products={products}
                          />
                      </Route>
                      <Route  path="/SalesOrders"
                              render={ (props) => <OrdersDisplay  {...props}
                                                                  order={props.order}
                                                                  orders={orders}
                                                                  products={products}
                                                                  customers={customers}
                                                                  updateOrders={this.updateOrders}
                                                                  updateSerials={this.updateSerials}
                                                                  />
                              }
                        />
                      <Route  path="/SerialNumbers"
                              render={ (props) =>  <SerialDisplay   {...props}
                                                                    products={products}
                                                                    serials={serials}
                                                                    customers={customers}
                                                                    orders={orders}
                                                                    rmas={rmas}
                                                                    updateRoot={this.updateSerials}
                                                    />
                              }
                      />
                      <Route  path="/RMAs"
                              render={ (props) =>  <RMADisplay {...props}
                                                              updateRoot={this.updateRMA}
                                                              customers={customers}
                                                              products={products}
                                                              serials={serials}
                                                              rmas={rmas}
                                                    />
                            }
                      />

                      <Route path="/Shipping"
                            render={(props) => <ShippingDisplay   {...props}
                                                                  customers={customers}
                                                                  products={products}
                                                                  serials={serials}
                                                                  orders={orders}
                                                                  rmas={rmas}
                                                />
                            }
                      />

                      <Route  path="/Customers"
                              render={(props) => <CustomerDisplay {...props}
                                                                  customers={customers}
                                                                  onUpdate={this.updateCustomers}
                                                  />
                              }

                      />
                      </>
                  
                }
                </DisplayContainer>
                <Route path="/addUser" component={AddUser}/>
              </Page>
            </Switch>
          </Suspense>
        </Root>
      </Router>
    );
  }

};
