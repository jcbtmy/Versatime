
import React from 'react';
import Paper  from "@material-ui/core/Paper"
import {NoteField, ProductField, SerialField} from "../Common/Fields";
import {NewButton} from "../Common/Buttons";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        gap: 10,
        flexGrow: 1,
        padding: "30px 30px 30px 30px",
        marginTop: 15,
        marginBottom: 40,
    }
}));


class _RMAItem extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            product: null,
            serial: null,
        };

        this.moduleParts = [
            "Radio", 
            "Bluetooth",
            "SD Card",
            "Membrane",
            "Board",
        ];

        this.lightParts = [
            "Green",
            "White",
            "Blue",
            "Amber",
            "Red",
        ];

        this.touchScreenParts = [
            "Power",
            "Touchscreen",
            "Stylus Pen",
            "Display",
        ];
    }

    setSerial = (event, serial) => {
        if(serial){ //if serial set then go fetch the serial to get data about it
            fetch("/api/serials/" + serial.serialNumber)
                .then((res) => { 
                    if(res.ok){
                        return res.json();
                    }
                    else{
                        console.log("Failed network request");
                    }
                })
                .then((res) => {
                    const product = (res) ? this.props.products.find((prod) => prod.productId === res.productId) : null;
                    this.setState({serial: res, product: product});
                })
                .catch((err) => console.log(err));
        }
        else{
            this.setState({serial: null});
        }
    }

    setProduct = (event, product) => {
        this.setState({ serial: null, product: product});
    }

    addItem = () => {

        const {product, serial } = this.state;

        if(product || serial) { //before adding check if either product or serial exists

            let tests = [];

            if(product.productId === "53060-10"){ //is it a touchscreen?
                this.touchScreenParts.map((part) => tests.push({passed: null, part: part, notes: ""}));
            }
            else{ //else check module
                this.moduleParts.map(part => tests.push({passed: null, part: part, notes : ""}));
            }

            this.props.addItem({ 
                product: product,
                serialNumber: (serial) ? serial.serialNumber : null,
                mesh: (serial) ? serial.mesh : null,
                issue: "",
                tests: tests,
            });
        }
    }

    

    render()
    {
        const {serial, product} = this.state;
        const {classes, products, serials} = this.props;


        return(
            <Paper elevation={2} className={classes.root}>
                    <SerialField value={serial} serials={serials} onChange={this.setSerial} edit/>
                    <ProductField value={product} products={products} onChange={this.setProduct} edit/>
                    <NewButton title="Add" onClick={this.addItem} />
            </Paper>
        );
    }
}


export default function RMAItem(props)
{
    const classes = useStyles();
    return <_RMAItem classes={classes} {...props}/>
}
