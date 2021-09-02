
import React from 'react';
import Paper  from "@material-ui/core/Paper"
import Box from "@material-ui/core/Box";
import { ProductField, SerialField, GeneralField} from "../Common/Fields";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from "@material-ui/core/Checkbox";
import {NewButton} from "../Common/Buttons";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flexGrow: 1,
        padding: "30px 30px 30px 30px",
        marginBottom: 40,
    },
    child : {
        display:'flex',
        gap: 10,
    }
}));


class RmaItem extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            product: null,
            serial: null,
            issue: null,
            warranty: null,
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

    setIssue = (event) => {
        this.setState({issue: event.target.value});
    }

    setWarranty = (value) => {
        this.setState({underWarranty: value});
    }

    addItem = () => {

        const {product, serial, issue, underWarranty} = this.state;

        if(product || serial) { //before adding check if either product or serial exists

            let tests = [];

            if(product.productId === "83000-24" || product.productId === "83000-15" || product.productId === "83000-17"){ //is it a touchscreen?
                this.touchScreenParts.map((part) => tests.push({passed: null, part: part, notes: ""}));
            }
            else{ //else check module
                this.moduleParts.map(part => tests.push({passed: null, part: part, notes : ""}));
            }

            this.props.addItem({ 
                product: product,
                serialNumber: (serial) ? serial.serialNumber : null,
                mesh: (serial) ? serial.mesh : null,
                issue: issue,
                tests: tests,
                underWarranty: underWarranty,
            });

            this.setState({
                product: null,
                serial: null,
                issue: null,
                underWarranty: null,
            });

        }
    }

    

    render()
    {
        const {serial, product, issue, underWarranty} = this.state;
        const {classes, products, serials} = this.props;


        return(
            <Paper elevation={2} className={classes.root}>
                <Box className={classes.child} width={1}>
                    <SerialField 
                        value={serial} 
                        serials={serials} 
                        onChange={this.setSerial} 
                        edit
                    />
                    <ProductField 
                        value={product} 
                        products={products} 
                        onChange={this.setProduct} 
                        edit
                    />
                   
                </Box>
                <Box className={classes.child} width={1}>
                    <GeneralField 
                        value={issue} 
                        onChange={this.setIssue} 
                        label="Issue"
                        edit
                    />
                    <Box width={300} >
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Under Warranty</FormLabel>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={(underWarranty === true) ? true : null} onChange={() => this.setWarranty(true)} />}
                                    label="Yes"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={(underWarranty === false) ? true : null } onChange={() => this.setWarranty(false)} />}
                                    label="No"
                                />
                            </FormGroup>
                        </FormControl>
                    </Box>
                    <NewButton title="Add" onClick={this.addItem} />
                </Box>
            </Paper>
        );
    }
}


export default function RMAItem(props)
{
    const classes = useStyles();
    return <RmaItem classes={classes} {...props}/>
}
