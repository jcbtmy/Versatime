import React from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import {NewButton} from "../Common/Buttons";

import { useDrag, useDrop} from 'react-dnd'


import { Typography } from "@material-ui/core";

const ItemTypes = {
    PRODUCT: 'product',
};

export function ItemDropTable(props){

    const [{ isOver, canDrop }, drop] = useDrop(

        () => ({
          accept: ItemTypes.PRODUCT,
          drop: (item) => props.addItem(item),
          collect: (monitor) => ({
            isOver: !!monitor.isOver(),
          })
        }),
    );
    
    return(
        <Box ref={drop}>
            {props.children}
        </Box>
    );
}


function DragItem(props) {

    const [{isDragging}, drag] = useDrag({
        type: ItemTypes.PRODUCT,
        item: props.item,
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <React.Fragment>
        {
            (props.item.quantity !== 0) && 
            <Paper ref={drag} style={{maxWidth: 300}}>
                <Box p={3} display="flex" flexDirection="column">
                    <Typography style={{color: "#3f51b5", fontWeight: 600,}}>{props.productName}</Typography>
                    <Typography>{"Quantity: " + props.item.quantity} </Typography>
                </Box>
            </Paper>
        }
        </React.Fragment>
        
    );  
}

export default class ShippingItems extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            serial: null,
            product: null,
            quantity: 0,
        }
    }


    setSerial = (event, serial) => {
        if(serial){
            const product = this.props.products.find((product) => serial.productId === product.productId );
            this.setState({serial: serial, product: product});
        }

    }

    setProduct = (event, product) => {
        this.setState({product: product, serial: null});
    }

    setQuantity = (event) => {
        this.setState({quantity: parseInt(event.target.value)});
    }


    addItem = () => {

        const {product, serial, quantity} = this.state;

        if(product && quantity && !serial){
            this.props.addItem({product: product, serial: serial, quantity: quantity});
        }

        this.setState({product: null, serial: null, quantity: 0});
    }

    render() 
    {
        const {products,availableItems} = this.props;
        const {serial,product, quantity} = this.state;

        return(
            <Box mt={1}>
                <Paper elevation={2} >
                    <Box padding={4} display="flex" flexDirection="row" style={{gap: 15}} flexWrap="wrap">
                            {
                                availableItems.map((item, i) => {
                                    if(item.productId){
                                        const productName = products.find(p => p.productId === item.productId).productName;
                                        return (
                                                <DragItem 
                                                    productName={productName}
                                                    item={item}
                                                />
                                        );
                                    }
                                })
                            }
                    </Box>
                </Paper>
            </Box>
        )
    }

} 