import React from 'react';
import {CollapseRow} from '../Common/TemplateTable';
import {OrderItemSerial} from "./OrderItemSerial";

import DoneIcon from "@material-ui/icons/Done";


export class OrderTestRow extends React.Component{


    constructor(props)
    {
        super(props);
        this.state  ={
            counter: 0,
        };
    }

    updateCounter = () => {
        
        let counter = 0;

        for(let i = 0; i < this.props.serials.length; i++)
        {
            const serial = this.props.serials[i];

            if(this.props.serialTests[serial])
            {
                counter += 1;
            }

        }

        this.setState({counter: counter});
    }
    
    componentDidMount(){
        this.updateCounter();
    }

    componentDidUpdate(prevProps){

        if(prevProps !== this.props)
        {
            this.updateCounter();
        }
    }

    addToCounter = () => {
        this.setState({counter : this.state.counter + 1});
    }

    serialTests = () => {
        return this.props.serials.map((serial ) => {
            return  <OrderItemSerial 
                        serial={serial} 
                        test={this.props.serialTests[serial]}
                        onTest={this.addToCounter}
                        orderNumber={this.props.orderNumber}
                        />
        });
    }


    render() {
        const {counter} = this.state;

        return (
            <CollapseRow   
                items={[ ...this.props.columns,
                        (counter !== this.props.quantity) ? <div>{counter}</div> : <DoneIcon style={{color:"green"}} />
                ]} 
                subItems={this.serialTests()}
            />
        );
    }
}

