import React from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper"

const useStyles = makeStyles(() => ({
    container: { 
        paddingBottom: 30, 
        width: "100%",
    },
    itemContainer: {
        display:"flex",
        gap: 20,
        padding:"20px 30px 20px 30px"
    },
    item:{
        flexBasis: "49%",
    }
}));

class Item extends React.Component{

    constructor(props)
    {
        super(props);
        this.state =  {
            product: {productName: ""},
            quantity: 0,
            buttonClicked: false,
        };
    }

    setQuantity = (event) => {
        this.setState({quantity: parseInt(event.target.value)});
    }

    setProduct = (event, value) => {
        this.setState({product: value});
    }

    updateParent = () => {
        const {quantity, product} = this.state;
        if(!(quantity && product))
            return;

        this.props.addItem({quantity: quantity, productName: product.productName, productId: product.productId});
        this.setState({quantity: 0, product: ""});
        
    }

    onClick = (event) => {
        this.setState({buttonClicked: true});
    }

    render(){
        const {product,quantity, buttonClicked} = this.state;
        const {classes, products, key} = this.props;

        return(
            <div className={classes.container}>
                <Paper className={classes.itemContainer}>
                    <Autocomplete
                        value={product}
                        key={key}
                        id="product"
                        options={products}
                        getOptionLabel={(option) => option.productName}
                        style={{width: 300}}
                        onChange={this.setProduct}
                        renderInput={(params) => <TextField {...params} variant="outlined" label="Product"/>}
                    />
                    <div  className={classes.item}>
                        <TextField
                            value={quantity}
                            id="Quantity"
                            label="Quantity"
                            type="number"
                            variant="outlined"
                            InputProps={{ inputProps:{min:0}}}
                            style={{flexGrow: 1}}
                            onChange={this.setQuantity}
                        />
                        
                        <IconButton size="medium" onClick={this.updateParent}>
                            <AddIcon fontSize="large" color="primary"/>
                        </IconButton>
                    </div>
                </Paper>
            </div>
        );
    }
}


export default function NewItem(props){
    const classes = useStyles();
    
    return <Item classes={classes} {...props} />
}