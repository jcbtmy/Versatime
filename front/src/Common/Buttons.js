import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import {Button} from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import EditIcon from "@material-ui/icons/Edit";
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


export const DownloadPackingSlipButton = (props) => {
    return(
        <Button style={{padding:7}}
                color="primary" 
                variant="contained"
                onClick={props.onClick}
        >
            Download Packing Slips
        </Button>
    );
}


export const UpdatePackingSlipsButton = (props) => {
    return(
        <Button
            style={{padding:7}}
            color="primary" 
            variant="contained"
            onClick={props.onClick}
        > 
            Update Packing Slips
        </Button>
    );
}


export const SubmitButton = (props) => {
    return (
        <Button
            style={{ marginBottom: 30, width: '100%', padding: "15px 0px 15px 0px"}} 
            color="primary" 
            variant="contained"
            onClick={props.onClick}
        >
            {props.children}
        </Button>
    );
}


export const NewButton = (props) => {

    return(
        <Tooltip title={props.title} placement="top">
            <IconButton onClick={props.onClick} size="small">
                <AddIcon color="primary" fontSize="large"/>
            </IconButton>
        </Tooltip>
    );
};

export const EditButton = (props) => {
    return(
        <Tooltip title="Edit" placement="top">
            <IconButton onClick={props.onClick} className={props.className}> 
                <EditIcon color={props.color}/>
            </IconButton>
        </Tooltip>
    );
}

export const OrderTestButton = (props) =>{

    return(
        <Tooltip title="Serials" placement="top">
            <IconButton 
                    onClick={props.onClick}>
            {
                props.open && <KeyboardArrowUpIcon />
            }
            {
                !props.open && <KeyboardArrowDownIcon />
            }
            </IconButton>
        </Tooltip>
    
    );
  
};


export const RmaTestBox = (props) => {

    const checkFailed = () => {
        props.onChange(props.i, false);
    };
    const checkPassed = () => {
        props.onChange(props.i, true);
    }
    
    return(
        <FormControl component="fieldset">
                        <FormGroup row>
                            <FormControlLabel
                                control={<Checkbox checked={(props.passed !== null && props.passed !== false) ? props.passed : null} style={{color: "green"}} onChange={checkPassed} />}
                                label="Passed"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={(props.passed === false) ? true : null } style={{color: "red"}} onChange={checkFailed} />}
                                label="Failed"
                            />
                        </FormGroup>
        </FormControl>
    );
}

export const SaveChangesButton = (props) => {

    return(
        <Button onClick={props.onClick} color="primary">
                Save Changes
        </Button>
    );
}

export const FileUploadButton = (props) => {
    return(
        <div style={{marginLeft: "auto"}}>
            <input  type="file" 
                    style={{display: "none"}} 
                    name="upload-file"
                    id="upload-file"
                    value={props.file}
                    onChange={props.uploadFile}
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
                <label htmlFor="upload-file" >
                    <Button variant="contained" color="primary" onClick={props.onChange}>
                        Upload File
                    </Button>
                </label>
        </div>
    );
}


export const ShippingOrderByInput = (props) => {
    return( 
        <ToggleButtonGroup exclusive value={props.value}>
            
        </ToggleButtonGroup>
    );
}

