import React from 'react';
import { makeStyles} from "@material-ui/core";
import Box from '@material-ui/core/Box';



const useStyles = makeStyles(() => ({
    
    display: {
            display: "flex",
            justifyContent: "center",
            flexDirection:"column",
            alignItems: "middle",
            paddingTop: 60,
            flexGrow: 1,
            gap: 40,
    },
    pageContent: {
            display: "flex",
            flexDirection: "column",
            alignItems:"center",
            justifyContent: "center",
    },
    page: {
        display: "flex",
        flexDirection: "row",
    },
    root: {
        flexGrow: 1,
    },
    displayContainer: {
        display: "flex",
        justifyContent: "center",
        flexGrow: 1,
        backgroundColor: "white",
        position: "absolute",
        maxWidth: 900,
        zIndex: 0,
        padding: "30px 50px 30px 50px",
        marginRight: "auto",
        marginLeft: "auto",
        left:0,
        right:0,
        border: "1px solid #E0E0E0",
        height: "auto",
    },
}));



export function Display(props){
    const classes = useStyles();
    return(
        <div className={classes.display}>
            {props.children}
        </div>
    );
}

export function ContentDisplay(props){
    const classes = useStyles();
    return (
        <div className={classes.pageContent}>
            {props.children}
        </div>
    );
}

export function DisplayContainer(props){
    const classes = useStyles();

    return(
        <div className={classes.displayContainer}>
            {props.children}
        </div>
    );
}

export function Root(props){
    const classes = useStyles();
    return(
        <div className={classes.root}>
            {props.children}
        </div>
    );
}

export function Page(props){
    const classes = useStyles();

    return(
        <div className={classes.page}>
            {props.children}
        </div>
    );
}

export function DisplayItem(props){
    return(
        <Box display="flex" flexDirection="column" style={{gap: 15}}>
            {props.children}
        </Box>
    );
}