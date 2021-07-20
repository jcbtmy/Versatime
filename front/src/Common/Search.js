import React from 'react';
import {makeStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {NewButton} from "./Buttons";
import {Title} from "../Text";

 
const useStyles = makeStyles(() => ({
    search : {
        flexGrow : 1,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "auto",
        borderBottom: "1px solid #E0E0E0",
        paddingBottom: 20,
        marginBottom: 15,
      },
      searchBarContainer: {
        display:"flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        marginTop: 15,
      },
      in:{
        fontSize: 20,
      }
}));


const SearchInput = (props) => {

    
    return(
        <Autocomplete
          id="combo-box-demo"
          onChange={props.onChange}
          options={props.options}
          ListboxProps={{ style: { maxHeight: "25rem" }}}
          style={{width: "100%", alignSelf:"center", }}
          getOptionLabel={props.getOptionLabel}
          renderInput={(params) => <TextField 
                                            {...params}  
                                            variant="outlined"
                                            InputProps={{...params.InputProps, classes: {root: props.className}}}
                                          
                                    />}
          />
    );
};


export  const SearchBar = (props) => {
    const classes = useStyles();
    return(
        <div className={classes.search}>
                  <Title variant="h5">
                    {props.label}
                    <div className={classes.searchBarContainer}>
                      <SearchInput className={classes.in} onChange={props.onChange} options={props.options} getOptionLabel={props.getOptionLabel}/>
                      {!props.noNew && <NewButton title="New" onClick={props.newOrderFunction} />}
                    </div>
                  </Title>
                  
        </div>
    )
}