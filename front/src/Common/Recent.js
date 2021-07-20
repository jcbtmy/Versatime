import { FormHelperText, makeStyles, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

import React from 'react';
import Box from "@material-ui/core/Box";


const useStyles = makeStyles(() => ({
    root: {
        display:"flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
    },
    child: {
        display: "flex",
        flexDirection: "column",
        width: 250,
        height: 120,
    },

    contents: {
        display:"flex",
        flexDirection:"row",
        flexWrap: "wrap",
        gap: 7,
        margin: 10,
    },

    text: {
        fontSize: 15,
        color: "gray",
    },

    title : {
        backgroundColor: "#eceef7",
        paddingTop: 8,
        paddingLeft: 8,
        paddingBottom: 8,
        display:"flex",
        color: "#3f51b5",
    }
}));

export function RecentItem(props){
    const classes = useStyles();

    return(
        <Paper className={classes.child} elevation={2} width={1}>
            <Box className={classes.title}>
                <b>{props.children[0]}</b>
            </Box>
            <Box className={classes.contents} width={1}>
                {
                    React.Children.map(props.children, (child, i) => {
                            return (i > 0) ? <Typography className={classes.text} key={i}>{child}</Typography> : null;
                    })
                }
            </Box>
        </Paper>
    );
}



export function Recent(props){
    const classes = useStyles();
    return(
        <Box className={classes.root} width={1}>
          {
            props.children
          }
        </Box>
    )
}