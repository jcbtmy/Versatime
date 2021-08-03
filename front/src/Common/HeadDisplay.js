import React from 'react';
import { makeStyles} from "@material-ui/core";
import {EditButton} from "../Common/Buttons";
import Paper from "@material-ui/core/Paper";
import {SaveChangesButton} from "../Common/Buttons";


const useStyles = makeStyles(() => ({

    rootConatiner: {
        display: "flex",
        flexDirection:"column",
        gap: 10,
        padding : "10px 30px 30px 30px",
        borderRadius: 1,
        marginTop: 15,
    },

    edit: {
        display: "flex",
        flexDirection: "row-reverse",
    },
    editButton:{ 
        fontSize: 10,
        display:"flex",
        flexDirection: "column",
    },
    content: {
        gap: 20,
        display: "flex",
        flexFlow: "wrap",
        position: "relative",
        alignItems: "center",
        maxWidth: 800,

    },
    item : {
        display: "flex",
        alignSelf:"stretch",
        paddingTop: 7,
        paddingBottom: 7,
    },
    id:{
        width: "100%",
        paddingBottom: 17,
    }

}));

class Head extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            color: "inherit",
            edit: null,
        };
    }

    componentDidMount()
    {
        this.setState({edit: this.props.edit});
    }

    componentDidUpdate(prevProps)
    {
        if(this.props !== prevProps)
        {
            this.setState({edit: this.props.edit});
        }
    }

    changeEdit = () => {
        const color = (!this.state.edit) ? "primary" : "inherit";
        this.setState({               
                color: color,
                edit: !this.state.edit,
        });
    }


    saveChanges = (event) => {
        this.changeEdit();
        this.props.updateHead(event);
    }

    render(){

        const {classes} = this.props;
        const {color, edit} = this.state;
        

        return(
            <Paper className={classes.rootConatiner} elevation={2}>
                {this.props.edit && 
                    <div className={classes.edit}>
                        <EditButton onClick={this.changeEdit} className={classes.editButton} color={color} /> 
                    </div>
                }
                {
                    !this.props.edit
                    &&
                    <div style={{paddingTop: 20}}></div>
                }
                <div className={classes.id}>{this.props.children[0]}</div>
                <div className={classes.content}>
                    {React.Children.map(this.props.children, (child, i) => {
                                    if(i > 0){
                                        let item;

                                        if(child.props.noEdit)
                                        {
                                            item = React.cloneElement(child, {edit: false});
                                        }
                                        else if(this.props.edit)
                                        {
                                            item = React.cloneElement(child, {edit: edit});
                                        }
                                        else{
                                            item = React.cloneElement(child, {edit: true});
                                        }
                                        return <div className={classes.item} key={i}>{item}</div>;
                                    }
                    })}
                    
                    <div style={{marginLeft: "auto", marginTop: 20,}}>{this.props.edit && this.props.change && <SaveChangesButton onClick={this.saveChanges} />}</div>
                </div>
            </Paper>
        );
    }
}

export default function HeadDisplay(props){
    const classes = useStyles();
    return <Head classes={classes} {...props} />

}