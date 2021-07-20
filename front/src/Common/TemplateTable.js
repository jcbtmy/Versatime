import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Tab} from "@material-ui/core";
import Collapse from '@material-ui/core/Collapse';
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import React from 'react';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignSelf: "center",
    height: "auto",
    overflowY:"hidden",
  },

  repairTable: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignSelf: "left",
    height:"100%",
    overflowY: "hidden",
    marginBottom: 15
  },
  tableHead: {
    backgroundColor: "#36435c",
    color: "white"
  },
  repairHead: {
    backgroundColor: 	"#1769aa",
    color: "white",
  },
  
  expandedElement : {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    maxHeight: 600,
    overflowY: "scroll",
    gap: 5,
    margin: "5px 15px 20px 15px",
  },
  row: {
    '& > *': {
      borderBottom: 'unset',
    }, 
  }
});

export const CollapseRow = (props) => {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    return(
      <React.Fragment>
        <TableRow className={classes.row}>
            {
                props.items.map((item, i) => <TableCell key={i} align={(i === 0) ? "left" : "center"}>{item}</TableCell>)
            }
            <TableCell>
                <IconButton aria-label="expand row"  size="small" onClick={() => setOpen(!open)}>
                    { open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={props.items.length + 1} align="center" style={{padding: "0px 0px 0px 0px"}}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box className={classes.expandedElement}>
                  {
                    props.subItems
                  }
                </Box>
              </Collapse>
          </TableCell>
      </TableRow>
    </React.Fragment>
    
    );
}



export const Row = (props) => {
    const classes = useStyles();
    return(
        <TableRow>
            {
                props.items.map((item, i) =><TableCell key={i} align={(i === 0) ? "left" : "center"}>{item}</TableCell>)
            }
        </TableRow>
    );
}

export const RepairTable = (props) => {
  const classes = useStyles();
  return(
    <TableContainer className={classes.repairTable} component={Paper}>
      <Table>
        <TableBody>
          {
            props.rows
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function GenTable(props){
  const classes = useStyles();

  return(
    <TableContainer component={Paper} className={classes.container} elevation={2} >
              <Table stickyHeader>
                {props.children}
              </Table>
    </TableContainer>
  );
}

export function GenTableHead(props){
  const classes = useStyles();
  return(
    <TableHead>
      <TableRow>
      {
        React.Children.map( props.children, (item, i) => <TableCell key={i} align={(i === 0) ? "left" : "center"} className={classes.tableHead}>{item}</TableCell>)
      }
      </TableRow>
  </TableHead>
  );
}

export function GenTableBody(props){
  return(
    <TableBody>
      {props.children}
    </TableBody>
  );
}

export function GenTableRow(props){

  return(
      <TableRow>
      {
          React.Children.map(props.children, (item, i) =><TableCell key={i} align={(i === 0) ? "left" : "center"}>{item}</TableCell>)
      }
      </TableRow>
  );
}

const TemplateTable = (props) => {
    const classes = useStyles(); 
    return(
          <TableContainer component={Paper} className={classes.container} elevation={2}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                  {
                    props.tableHead.map( (item, i) => <TableCell key={i} align={(i === 0) ? "left" : "center"} className={classes.tableHead}><b>{item}</b></TableCell>)
                  }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    props.rows
                  }
                </TableBody>
              </Table>
          </TableContainer>
    );
}


export default TemplateTable;