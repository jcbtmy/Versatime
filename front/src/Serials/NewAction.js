import React from 'react';
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {makeStyles} from "@material-ui/core";
import {RmaTestBox} from "../Common/Buttons";
import {NoteField, OrderField, RMAField} from "../Common/Fields";
import {Title} from "../Text";


const useStyles = makeStyles((theme) => ({
    root: {
        display : "flex",
        flexDirection: "column",
        padding:"40px 20px 40px 20px",
        gap: 15,
        borderTop: "1px solid #E0E0E0",
        flexGrow: 1,
    },
    numberFields : {
        display:"flex",
        flexDirection: "row",
        gap: 10,
        height: "100%",
    },
    btnGroup:{
        alignSelf: "flex-start",
    },
    test:{
        color:  "green",
    },
    ship: {
        color: "blue",
    },
    receive: {
        color: "purple",
    },
}));

class Action extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            action : "",
            note: "",
            orderNumber: null,
            RMANumber: null,
            passed: null,
            buttonClicked: false,
        }
    }

    componentDidUpdate(prevProps){

        if(this.props !== prevProps)
        {
            this.setState({
                action : "",
                note: "",
                orderNumber: null,
                RMANumber: null,
                passed: null,
            })
        }
    }

    onClick = (event, action) => {
        this.setState({action: action});
    }

    setRma = (event, rma) => {
        this.setState({RMANumber: (rma) ? rma.RMANumber : null});
    }

    setOrder = (event, order) => {


        if(order && order.orderNumber){
            this.setState({orderNumber: order.orderNumber });
        }
        else{
            this.setState({orderNumber: order});
        }

    }
    buttonClick = () => {
        this.setState({buttonClicked: true});
    }
    setNote = (event) => {
        this.setState({note: event.target.value});
    }

    setPassed = (i, value) => {
        this.setState({passed: value});
    }

    addAction = () => {
        const {action, note, orderNumber, RMANumber, passed} = this.state;

        if(action){
            this.props.addHistory({ 
                                    action: action, 
                                    note: note, 
                                    orderNumber: orderNumber, 
                                    RMANumber: RMANumber,
                                    passed: passed,
            });
            this.setState({action: null, buttonClicked:false});
        }
    }

    render()
    {
        const {classes} = this.props;
        const {action, note, orderNumber, RMANumber, buttonClicked} = this.state;

        return(
            <div>
            
            { !buttonClicked && 
                <Button onClick={this.buttonClick} color="primary">
                    Add Action
                </Button>
            }{
                buttonClicked &&
                <Title variant="h5">
                    New Action
                </Title>
                    
            }
            { buttonClicked &&

                <Paper className={classes.root} elevation={2}>
                    <ToggleButtonGroup variant="outlined" className={classes.btnGroup} exclusive value={action} onChange={this.onClick}>
                        <ToggleButton className={classes.test} value="Tested">
                            Test
                        </ToggleButton>
                        <ToggleButton className={classes.ship} value="Shipped">
                            Ship
                        </ToggleButton>
                        <ToggleButton className={classes.receive} value="RMA">
                            RMA
                        </ToggleButton>
                    </ToggleButtonGroup>              
                    <div className={classes.numberFields}>
                            <OrderField edit orders={this.props.orders} value={{orderNumber: orderNumber}} onChange={this.setOrder}/>
                            <RMAField edit rmas={this.props.rmas} value={{RMANumber: RMANumber}} onChange={this.setRma}/>
                    </div>
                {action === "Tested" && <RmaTestBox onChange={this.setPassed} i={0} />}
                <NoteField edit rows={1} rowMax={1} value={note} onChange={this.setNote} /> 
                <Button variant="contained" className={classes.btnGroup} color="primary" onClick={this.addAction}>
                    Submit
                </Button>

            </Paper>
            }
        </div>
        );
    }


}

export default function NewAction(props){
    const classes = useStyles();
    return <Action classes={classes} {...props} />;
}


