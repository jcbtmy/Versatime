import { makeStyles, Button} from "@material-ui/core";
import {useState} from "react";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(() => ({
    container:{
        display: "flex",
        alignItems:"center",
        width: "80%",
        borderRadius: 2,
        padding: "7px 10px 7px 10px",
    },
    left :{
        marginRight: "auto"
    },
    right : {
        alignSelf: "flex-end",
        display: "flex", 
        gap: 10,
        alignItems:"center",
        justifyContent: "center",
    }
}));


export function OrderItemSerial(props){

    const classes = useStyles();

    const clicked = (props.test === undefined) ? false : true;

    let pass = null;
    
    let fail = null;

    if(props.test === true)
    {
        pass = true;
    }
    else if(props.test === false)
    {
        fail = true;
    }

    const [testClick, settestClick] = useState(clicked);

    const [passed, setPassed] = useState(pass);

    const [failed, setFailed] = useState(fail);

    const [err, setErr] = useState(null);

    const checkPassed = () => {
        setFailed(false);
        setPassed(true);
    }

    const checkFailed = () => {
        setFailed(true);
        setPassed(false);
    }

    const testClicked = async() => {

        let testresult;

        if(failed === true)
        {
            testresult = false;
        }
        else if(passed === true)
        {
            testresult = true;
        }
        else{
            testresult = null;
        }

        const serialTest = {
            orderNumber: props.orderNumber,
            action: "Tested",
            note: "",
            passed: testresult,
            RMANumber: null,
        };


        const headers = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serialTest),
            };


        fetch("/api/serials/addHistory/" + props.serial, headers)
            .then((res) => {
                if(res.ok)
                {
                    props.onTest();
                    settestClick(true);
                }
                else{
                    res.json().then((error) => setErr(error.message));
            
                }
            })
            .catch((err) => {
                setErr(err.message);
            })
    }

    return(
        <Paper className={classes.container}>
            <Typography className={classes.left}><b>Serial Number</b> : <b>{ props.serial }</b></Typography>
            <div className={classes.right}>
                <Typography>Testing</Typography>
                {err && <Typography style={{color: "red"}}>{err}</Typography>}
                { 
                    !testClick
                    &&
                    <>
                    <FormControl component="fieldset">
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox checked={passed} style={{color: "green"}} onChange={checkPassed} />}
                                    label="Passed"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={failed} style={{color: "red"}} onChange={checkFailed} />}
                                    label="Failed"
                                />
                            </FormGroup>
                    </FormControl>
                    <Button variant="contained"
                                color="primary"
                                style={{backgroundColor: "green"}}
                                size="small"
                                onClick={testClicked}
                        >
                            Test
                    </Button>
                    </>
                    
                }

                {
                    (testClick && passed)
                    &&
                    <>
                        <DoneIcon style={{color: "green"}}/>
                        <Typography style={{color: "green",width: 100}}>Passed</Typography>
                    </>
                }
                {
                    (testClick && failed)
                    &&
                    <>
                        <ClearIcon style={{color: "red"}}/>
                        <Typography style={{color: "red", width: 100}}>Failed</Typography>
                    </>
                }
                </div>
        </Paper>
    )
}