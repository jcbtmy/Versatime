import React from 'react';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
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
        justifyContent: "center",
        display: "flex",
    }
}));

class Item extends React.Component{

    constructor(props)
    {
        super(props);
        this.state =  {
            product: {productName: ""},
            quantity: 0,
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

    render(){
        const {product,quantity} = this.state;
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
                        
                        <IconButton size="small" onClick={this.updateParent} style={{alignSelf:"center"}}>
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