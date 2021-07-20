import  Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    title : {
        flexGrow:1,
        userSelect:"none",
    },
    text : {
        flexGrow: 1,
    },
}));

export const Text = (props) =>{
    const classes = useStyles();
    const addClass = (props.className) ? " " + props.className : "";
    return (
        <Typography variant="body1" className={classes.text + addClass}>
          {props.children}
        </Typography>
    );
}

export const Title = (props) => {
    const classes = useStyles();
    const variant = (props.variant) ? props.variant : "h6";
    const addClass = (props.className) ? " "  + props.className : "";

    return (
        <Typography variant={variant} className={classes.title + addClass}>
          {props.children}
        </Typography>
    );
}
  

