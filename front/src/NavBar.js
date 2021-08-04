import "./css/NavBar.css";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { Title} from "./Text";
import {Link} from "react-router-dom";
import logo from "./Logo-Alone.ico";
import Paper from "@material-ui/core/Paper";
import Slide from '@material-ui/core/Slide';


const useStyles = makeStyles((theme) => ({

   
    menuBar: {
        flexGrow: 1,
        display: "flex",
        flexDirection:"column",
        paddingTop: 75,
        padding: 15,
        overflowY: "hidden",
        zIndex: 10,
        gap:1,
        backgroundColor: "white",
        positon: "relative",
        width: "auto",
        height: "100%",
        overflowX: "hidden",
    },
    appBar: {
        display: "flex",
        backgroundColor: "#36435c",
        zIndex: 11,
    },

    menuItem: {
        textAlign: "left",
        userSelect: "none",
        padding: "2px",
        width: "100%",
        
    },
    linkStyle: {
        textDecoration: "none",
        color:"black",
        width: "100%", 
        height: "100%"
    },
    toolBar : {
        display: "flex",
        gap: 10,
    },
    currentRoute : {
        backgroundColor: '#c9c9c9',
        width: "100%",
    },

    img : {
        height: 48,
        width: 48,
        "& img":{
            height:"auto",
            widht: "auto",
            maxHeight: "100%",
            maxWidth: "100%",
        }

    },
    transitionContainer : { 
        display: "flex",
        zIndex: 1,
        flexGrow: 1,
        width: "auto",
        position:"fixed",
        alignSelf: "stretch",
    },

    item : {
        fontSize: 18,
        display: "flex",
        gap: 5,
    },

    userMenu:{
        position:"absolute",
        zIndex: 11,
        right: 20,
    },

    brandLink :{
        textDecoration: "none",
        display: "flex", 
        gap: 15, 
        alignItems: "center",
        justifyContent:"center",
        color: "white",
    }
}));

const Logo = (props) => {

    const classes = useStyles();

    return(
       
            <div className={classes.img}>
                <img src={logo} alt="Logo"/>
            </div>
    );
};


const BrandLink = (props) => {
    const classes = useStyles();

    return(
        <Box width={1} >
            <Link to="/" className={classes.brandLink}>
                <Logo />
                <Title>VersaTime</Title>
            </Link>
        </Box>
    );
}

export const MenuBar = (props) => {

    const classes = useStyles();
    const [page, changePage] = useState();

    const update = (i) => {
        changePage(i);
    };

    const mapRoutes = (route, i ) => {

        const focusRoute = (i === page) ? classes.currentRoute : "";
        return(
            <div    key={i} 
                    onClick={(e) => update(i)} 
                    className={classes.menuItem}
                    >
                    <Link to={route.path} className={classes.linkStyle}>
                        <MenuItem className={classes.item + ' ' + focusRoute}>{route.icon} {route.text}</MenuItem>
                    </Link>
            </div>
        );
    };

    return (
        <div className={classes.transitionContainer}>
           <Slide direction="right" in={props.isOpen} unmountOnExit>
                <Paper className={classes.menuBar}>
                        {
                            props.routes.map(mapRoutes)
                        }
                </Paper>
            </Slide>
        </div>
    );
}

function UserMenu(props){

    const [menuAnchor, setMenuAnchor] = useState(false);
    const classes = useStyles();

    const handleClick = (event) => {
        setMenuAnchor(!menuAnchor);
    }

    const logout = () => {
        fetch("/user/logout", {method: "POST", redirect: "follow"})
        .then((res) => {
            if(res.redirected)
            {
                window.location.href = res.url;
            }
        })
        .catch((err) => {});
    }


    return(
        <div>
            <AccountCircleIcon fontSize="large" onClick={handleClick}/>
            { menuAnchor && 
                <Paper className={classes.userMenu}>
                    <Link to="/addUser" className={classes.linkStyle}>
                         <MenuItem onClick={handleClick}>Add User</MenuItem>
                    </Link>
                    <Link to="/myAccount" className={classes.linkStyle}>
                        <MenuItem onClick={handleClick}>My Account</MenuItem>
                    </Link>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                </Paper>
            }
        </div>
    );
}


export const NavBar = (props) => {

    const classes = useStyles();

    return (
            <AppBar position="fixed" className={classes.appBar}>
                <ToolBar className={classes.toolBar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={props.handleMenuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <BrandLink />
                    <UserMenu />
                </ToolBar>
            </AppBar>  
    );

}


