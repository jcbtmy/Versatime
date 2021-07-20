import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Message} from "../Common/Message";
import React from "react";



export default class AddUser extends React.Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            username: null,
            password: null,
            confirmPassword: null,
            role: null,
            messsage: null,
            
        };
    }


    setRole = (role) => {
        this.setState({role: role});
    }

    setUsername = (event) => {
        this.setState({username: event.target.value});
    }

    setPassword = (event) => {
        this.setState({password: event.target.value});
    }
    setConfirmPassword = (event) => {
        this.setState({confirmPassword: event.target.value});
    }


    submit = async() => {
        
        if(!this.state.username || !this.state.password || this.state.role === null || this.state.password !== this.state.confirmPassword)
        {
            return;
        }

        console.log(this.state.password);

        const sjcl = window.sjcl;
        const bitArray = sjcl.hash.sha256.hash(this.state.password);
        const password = sjcl.codec.hex.fromBits(bitArray);   

        console.log(password);


        fetch("/user/signup", {

            method: "POST",
            headers:{
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({  username: this.state.username, 
                                    password: password, 
                                    role: this.state.role})

        }).then((res) => {
            if(res.ok)
            {
                this.setState({ username: null,
                                password: null,
                                role: null,
                                confirmPassword: null,
                                message:{error: false , text: this.state.username + " succesfully created"}});     
            }
            else{
                res.json().then((err) => this.setState({message: {error: true, text: err.msg}}));
            }

        }).catch((err) => {
            alert(err.message);
        })

    } 
    
    render(){  

        const {username, password,  confirmPassword ,role, message} = this.state;

        return(
            <Box mx="auto" style={{marginTop: "25vh"}}>
                <Paper elevation={2}>
                        <Box p={6} display="flex" flexDirection="column" style={{gap: 23}}>
                            <Typography variant="h6">Add User</Typography>
                            {message && <Message error={message.error}  text={message.text} clear={() => this.setState({message: null})}/>}
                            <TextField
                                error={(!username) ? true: false}
                                label="Username"
                                value={(username) ? username: ""}
                                onChange={this.setUsername}
                                helperText={(!username) ? "Please enter a username": ""}
                                variant="outlined"
                                autoComplete="off"
                                style={{width: 300}}
                                InputLabelProps={{shrink: true}}
                            />
                            <TextField
                                error={(!password) ? true: false}
                                label="Password"
                                onChange={this.setPassword}
                                value={(password) ? password: ""}
                                helperText={(!password) ? "Please enter a password" : ""}
                                variant="outlined"
                                type="password"
                                autoComplete="off"
                                style={{width: 300}}
                                InputLabelProps={{shrink: true}}
                            />
                             <TextField
                                error={(confirmPassword !== password || !confirmPassword) ? true: false}
                                value={(confirmPassword) ? confirmPassword : ""}
                                onChange={this.setConfirmPassword}
                                label="Confirm Password"
                                helperText={(confirmPassword !== password || !confirmPassword ) ? "passwords dont match" : ""}
                                variant="outlined"
                                type="password"
                                autoComplete="off"
                                style={{width: 300}}
                                InputLabelProps={{shrink: true}}
                            />
                             <FormControl component="fieldset" style={{marginLeft: "auto", marginRight: "auto"}}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={(role === 0) ? true : false} onChange={() => this.setRole(0)}/>}
                                        label="Admin"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={(role === 1) ? true : false} onChange={() => this.setRole(1)}/>}
                                        label="User"
                                    />
                                </FormGroup>
                            </FormControl>
                            <Button variant="contained" color="primary" onClick={this.submit}>
                                Submit
                            </Button>

            
                        </Box>
                </Paper>
            </Box>

        );
    }
}