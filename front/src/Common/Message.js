import {useState, useEffect} from 'react';
import Paper from "@material-ui/core/Paper";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core";
import {Text} from "../Text";
import { Fade } from '@material-ui/core';


const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        gap: 15,
        padding: 15,
        width: "auto",
        position: "fixed",
        bottom: 25,
        left: 25,
        marginTop: 5,
        marginBotton: 20,
        alignItems: "center",
    },

    success : {
        backgroundColor: "#357a38",
    },

    error : {
        alignItems:"center",
        backgroundColor: "red",
    },
    text: {
        alignItems:"center",
        color: "white"
    }
}));


export const Message = (props) => {

    const classes = useStyles();
    const messageClassType = (props.error) ? `${classes.root} ${classes.error}` : `${classes.root} ${classes.success}`;

    return(    
                <Paper elevation={1} className={messageClassType}>
                    {
                        props.error && <ClearIcon style={{color:"white"}} />
                    }
                    {
                        !props.error && <DoneIcon style={{color:"white"}}/>
                    }
                    <Text className={classes.text}>{props.text}</Text>

                    <IconButton size="small" onClick={props.clear}>
                        <ClearIcon style={{marginLeft: "auto", color: "#E0E0E0"}}/>
                    </IconButton>
                </Paper>
    );
}