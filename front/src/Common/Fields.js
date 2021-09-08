import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles} from "@material-ui/core";
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from"@material-ui/core/Select";
import React from "react";

const useStyles = makeStyles(() => ({
    textFieldRoot: {
        fontSize:  18,
        "& .Mui-disabled": {
            color: "black",
        },
        minWidth: "24vw",
       
    },
    identifierRoot:{
        fontSize:  20,
        "& .Mui-disabled": {
            color: "black",
        },
        height: "auto",
        width:"100%",
    },

    multilineRoot:{
        fontSize: 18,
        "& .Mui-disabled": {
            color: "black",
        },
        width: "24vw",
    },
    fullWidth : {
        flexGrow: 0,
    },
    noteWidth : {
        width: "24vw",
        height: "100%",
    },
    labelIdRoot: {
        fontSize: 20,
        
    },
    labelRoot:{
        fontSize: 20
    },
    labelFocused: {}


}));


const getInputProps = (params, classes, props) => {

    let InputProps;
    if(params){
        InputProps = {
            ...params.InputProps,
            classes: {root: classes.textFieldRoot},
        }
    }
    else{
        InputProps = {classes: {root: classes.textFieldRoot}};
    }

    if(!props.edit){
        InputProps.disableUnderline = true;
    }

    return InputProps;

}


export const CustomerField = (props) => {
    
    const classes = useStyles();

    return(
        <Autocomplete id="customer"
                options={props.customers}
                getOptionLabel={(option) => option.customerName}
                disabled={!props.edit}
                onChange={props.onChange}
                value={props.value}
                freeSolo
                className={classes.fullWidth}
                renderInput={(params) => <TextField   {...params}
                                                        label="Customer"
                                                        variant={(props.edit) ? "outlined" : "standard" }
                                                        InputProps={getInputProps(params, classes, props)}
                                                        InputLabelProps={{
                                                             ...params.InputLabelProps,
                                                            classes: {root: classes.labelRoot},
                                                            shrink: true 
                                                        }}
                                        
                                                        />}
                            />
    );
}

export const ProductField = (props) => {
    const classes = useStyles();
    
    return(
        <Autocomplete id="product"
                options={props.products}
                getOptionLabel={(option) => option.productName}
                disabled={!props.edit}
                onChange={props.onChange}
                value={props.value}
                freeSolo
                className={classes.fullWidth}
                renderInput={(params) => <TextField   {...params}
                                                        label="Product"
                                                        variant={(props.edit) ? "outlined" : "standard" }
                                                        InputProps={getInputProps(params, classes, props)}
                                                        InputLabelProps={{
                                                            ...params.InputLabelProps,
                                                           classes: {root: classes.labelRoot},
                                                           shrink: true
                                                        }}
                                                        />}
                            />
    );
};

export const DateField = (props) => {
    const classes = useStyles();
    const label = (!props.label) ? "Expr Date" : props.label;
    const now = new Date();

    return(
        <TextField
                        id="date"
                        label={label}    
                        type="date"
                        defaultValue="yyyy-MM-dd"
                        variant={(props.edit) ? "outlined" : "standard" }
                        value={(props.value) ? props.value.toISOString().substring(0, 10) : now.toISOString().substring(0,10)}
                        disabled={!props.edit}
                        className={classes.fullWidth}
                        InputProps={getInputProps(null, classes, props)}
                        InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}} 
                        onChange={props.onChange}
            />
    );
}

export const ShippingField = (props) => {
    const classes = useStyles();
    return(
        <TextField
            id="customer-ship-to"
            label="Ship To"
            multiline
            rows={4}
            className={classes.fullWidth}
            rowsMax={10}
            value={(props.value) ? (props.value) : ""}
            variant={(props.edit) ? "outlined" : "standard" }
            InputProps={getInputProps(null, classes, props)}
            InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}} 
            disabled={!props.edit}
            onChange={props.onChange}
        /> 
    );
}

export const ToField = (props) => {
    const classes = useStyles();

    return(
        <TextField
            id="customer-to"
            label="To"
            value={(props.value) ? (props.value) : ""}
            multiline
            className={classes.fullWidth}
            rows={4}
            rowsMax={10}
            variant={(props.edit) ? "outlined" : "standard" }
            InputProps={getInputProps(null, classes, props)}
            InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}} 
            disabled={!props.edit}
            onChange={props.onChange}
        />
    );
}


export const IdentifierField = (props) => {
    const classes = useStyles();
    let InProps = {
        classes:{root: classes.identifierRoot}
    }
    if(!props.allowEdit)
    {
        InProps.readOnly = true;
    }

    return(
        <TextField
                error={!props.value}
                variant={(props.edit) ? "outlined" : "standard" }
                helperText={(!props.value) ? props.label + " Required" : ""}
                label={props.label}
                value={(props.value) ? props.value : ""}
                InputProps={InProps}
                fullWidth
                onChange={props.onChange}
                InputLabelProps={{
                    classes: {
                        root: classes.labelIdRoot,
                        focused: classes.labelFocused
                    },
                    shrink: true
                }}
                    />

    );
}


export const MeshField  = (props) => {
    const classes = useStyles();
    return(
        <TextField
                label="Mesh"
                value={(props.value) ? (props.value) : " "}
                variant={(props.edit) ? "outlined" : "standard" }
                InputProps={getInputProps(null, classes, props)}
                InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}} 
                className={classes.fullWidth}
                disabled={!props.edit}
                onChange={props.onChange}
                />
    );
}


export const BluetoothField = (props) => {
    const classes = useStyles();
    return(
        <TextField  label="BlueTooth"
                    variant={(props.edit) ? "outlined" : "standard" }
                    value={(props.value) ? props.value : ""}
                    InputProps={getInputProps(null, classes, props)}
                    InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}} 
                    className={classes.fullWidth}
                    disabled={!props.edit}
                    onChange={props.onChange}
            />
    );
}


export const VersionField = (props) => {
    const classes = useStyles();
    return(
        <TextField      label="Version"
                        variant={(props.edit) ? "outlined" : "standard" }
                        value={(props.value) ? props.value : ""}
                        InputProps={getInputProps(null, classes, props)}
                        InputLabelProps={{classes: {root: classes.labelRoot},shrink: true}} 
                        className={classes.fullWidth}
                        disabled={!props.edit}
                        onChange={props.onChange}
                />
    );
}
export const NoteField = (props) => {
    const classes = useStyles();
    return(
        <TextField  label={(props.label) ? props.label : "Notes"}
                    value={(props.value) ? props.value : ""}
                    variant={(props.edit) ? "outlined" : "standard" }
                    onChange={props.onChange}
                    multiline
                    rows={(props.rows) ? props.rows : 4}
                    rowsMax={(props.rowsMax) ? props.rowsMax : 10}
                    InputProps={getInputProps(null, classes, props)}
                    InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}}
        />
    );
}

export const GeneralField = (props) => {
    const classes = useStyles();
    return(
            <TextField  label={props.label}
                        InputProps={getInputProps(null, classes, props)}
                        InputLabelProps={{classes: {root: classes.labelRoot},shrink: true}} 
                        value={props.value}
                        variant={(props.edit) ? "outlined" : "standard" }
                        onChange={props.onChange}
            />
    );
}

export const QuantityField = (props) => {
    const classes = useStyles();
    return(
        <TextField
                            InputProps={{classes: {root: classes.textFieldRoot}, inputProps:{min:0},disableUnderline: !props.edit,}}
                            InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}} 
                            value={props.value}
                            onChange={props.onChange}
                            id="Quantity"
                            label="Quantity"
                            type="number"
                            variant={(props.edit) ? "outlined" : "standard" }
                        />
    );
}


export const SerialField = (props) => {
    const classes = useStyles();
    return(
        <Autocomplete id="serial"
            options={props.serials}
            getOptionLabel={(option) => String(option.serialNumber)}
            onChange={props.onChange}
            value={props.value}
            freeSolo
            renderInput={(params) => <TextField label="Serial Number"
                                                 variant={(props.edit) ? "outlined" : "standard" }
                                                {...params}
                                                InputProps={getInputProps(params, classes, props)}
                                                InputLabelProps={{
                                                    ...params.InputLabelProps,
                                                   classes: {root: classes.labelRoot},
                                                   shrink: true 
                                                }}
                                                />}
                    />
    );
}

export const OrderField = (props) => {
    const classes = useStyles();
    return(
        <Autocomplete id="order"
            multiple={(props.multiple) ? true : false}
            options={props.orders}
            getOptionLabel={(option) => (option.orderNumber) ? String(option.orderNumber) : ""}
            onChange={props.onChange}
            value={(props.value) ? props.value : {orderNumber: null}}
            disabled={!props.edit}
            freeSolo
            autoSelect
            renderInput={(params) => <TextField label="Order Number"
                                                variant={(props.edit) ? "outlined" : "standard" }
                                                {...params}
                                                InputProps={getInputProps(params, classes, props)}
                                                InputLabelProps={{
                                                    ...params.InputLabelProps,
                                                   classes: {root: classes.labelRoot}, 
                                                   shrink: true,
                                                }}
                                                />}
                    />
    );
}

export const RMAField = (props) => {
    const classes = useStyles();
    return(
        <Autocomplete id="rma"
            multiple={(props.multiple) ? true : false}
            options={props.rmas}
            getOptionLabel={(option) => (option.RMANumber) ? String(option.RMANumber) : ""}
            onChange={props.onChange}
            value={(props.value) ? props.value : {RMANumber: null}}
            disabled={!props.edit}
            freeSolo
            autoSelect
            renderInput={ (params) => <TextField label="RMA Number"
                                                variant={(props.edit) ? "outlined" : "standard" }
                                                {...params}
                                                InputProps={getInputProps(params, classes, props)} 
                                                InputLabelProps={{
                                                    ...params.InputLabelProps,
                                                   classes: {root: classes.labelRoot}, 
                                                   shrink: true
                                                }}
                                        />

            }
        />
    );
}


export const TrackingNumberField = (props) => {
    const classes = useStyles();
    return(
            <TextField  label="Tracking Number"
                        InputProps={getInputProps(null, classes, props)}
                        InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}} 
                        value={(props.value) ? props.value: ""}
                        variant={(props.edit) ? "outlined" : "standard" }
                        onChange={props.onChange}
                        disabled={!props.edit}
            />
    );
}

export const POField = (props) => {
    const classes = useStyles();
    return(
            <TextField  label="PO Number"
                        InputProps={getInputProps(null, classes, props)}
                        InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}} 
                        value={(props.value) ? props.value : " "}
                        variant={(props.edit) ? "outlined" : "standard" }
                        onChange={props.onChange}
                        disabled={!props.edit}
            />
    );
}

export const ShippingServiceField = (props) => {
    const classes = useStyles();
    return(
        <Autocomplete id="shipping"
        options={props.options}
        getOptionLabel={(option) => option}
        onChange={props.onChange}
        value={(props.value) ? (props.value) : ""}
        disabled={!props.edit}
        freeSolo
        renderInput={ (params) => <TextField label="Shipping Service"
                                            variant={(props.edit) ? "outlined" : "standard" }
                                            {...params}
                                            InputProps={getInputProps(params, classes, props)} 
                                            InputLabelProps={{
                                                ...params.InputLabelProps,
                                               classes: {root: classes.labelRoot}, 
                                               shrink: true
                                            }}
                                    />

        }
        />
    );
}



export const BoxNumberField = (props) => {
    const classes = useStyles();

    return(

         <TextField label="Box Number"
                    InputProps={getInputProps(null, classes, props)}
                    InputLabelProps={{classes: {root: classes.labelRoot}, shrink: true}} 
                    value={props.value}
                    variant={"standard" }
                    disabled={true}
        />
    );
}


export const MultipleSerials = (props) => {

    return (
        <>
            <InputLabel id="demo-mutiple-name-label">{props.label}</InputLabel>
            <Select
                labelId="mutiple-serial-label"
                id="mutiple-name-serial"
                multiple
                input={<Input />}
                value={[]}
                >
                {props.serials.map((serial) => (
                    <MenuItem key={serial} value={serial}>
                        {serial}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
}