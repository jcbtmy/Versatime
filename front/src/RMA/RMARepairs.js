
import React from 'react';
import {NoteField} from "../Common/Fields"
import {Row, RepairTable} from "../Common/TemplateTable";
import {RmaTestBox} from "../Common/Buttons";
import { Button, Typography } from '@material-ui/core';
import { Title } from '../Text';

export default class RMARepair extends React.Component{

    constructor(props)
    {
        super(props);
        this.state  = { 
            tests : null,
        };

        //different tests
        this.moduleParts = [
            "Radio", 
            "Bluetooth",
            "SD Card",
            "Membrane",
            "Board",
        ];

        this.lightParts = [
            "Green",
            "White",
            "Blue",
            "Amber",
            "Red",
        ];

        this.touchScreenParts = [
            "Power",
            "Touchscreen",
            "Stylus Pen",
            "Display",
        ];
    }

    componentDidMount(){
        this.setState({tests: this.props.tests});
    }

    componentDidUpdate(prevProps){
        if(prevProps != this.props){
            this.setState({tests: this.props.tests});
        }
    }

    setNote = (event, i) => {
        this.setState((prevState) => {
            const tests = prevState.tests;
            tests[i].notes = event.target.value;
            return tests
        });
    }

    setPassed = (i, value) => {
        this.setState((prevState) => {
            const tests = prevState.tests;
            tests[i].passed = value;
            return tests;
        });
    }

    updateSerialTest = async() => {

        const testingResults = { //test action for serial number
            action: "Tested", 
            note: "", 
            orderNumber: null, 
            RMANumber: this.props.rmaNumber,
            passed: null,
        };

        for(let i = 0; i < this.state.tests.length; i++) //check if all test passed, else test failed
        {
            if(this.state.tests[i].passed == false ) //if failed test update the serial with note and failed test
            {
                testingResults.passed = false;
                testingResults.note = this.state.tests[i].notes;
                break;
            }
            else{
                testingResults.passed = this.state.tests[i].passed;
            }
        }

        const headersSerial = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testingResults),
        };

        //update serial history to reflect testing
        fetch("/api/serials/addHistory/" + this.props.serialNumber, headersSerial)
            .then((res) => {
                if(res.ok)
                {
                    return res.json();
                }

                res.json().then((error) => this.props.updateMessage({error: true, text: error.message}));           
            })
            .catch((error) => {
                this.props.updateMessage({error: true, text: error.message});
            });
    }

    updateTests = () => { //updates the test for RMA and the serial being tested if exists     

        const updateBody = {
            itemId: this.props.itemId,
            tests: this.state.tests,
        }

        const headersTest = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateBody),
        };

        if(this.props.serialNumber)
        {
            this.updateSerialTest();
        }

        fetch("/api/rmas/updateTests/" + this.props.rmaNumber, headersTest)
            .then((res) => {
                if(res.ok)
                {
                    return res.json();
                }
                res.json().then((err) => this.props.updateMessage({error:true, text: err.message}));
            })
            .then((res) => {
                if(res)
                {
                    this.props.updateMessage({error: false, text: "Test succesfully updated"});
                }
            })
            .catch(err => this.props.updateMessage({error: true, text: err.message}));
    }

    render(){
        const {tests}= this.state;
        return(
            <React.Fragment>
            <Title>Parts Test</Title>
            {tests &&
                <RepairTable
                    rows={tests.map((test, i) => <Row  key={i} items={[   <b>{test.part}</b>,
                                                                <RmaTestBox passed={test.passed} i={i} onChange={this.setPassed}/>,
                                                                <NoteField  value={test.notes} onChange={(e) => this.setNote(e, i)} rows={1} rowsMax={2} />]}                     
                                                />)}
                />
            }
            {
                !this.props.new && 
                <Button variant="contained" style={{margin: 20}} color="primary" onClick={this.updateTests}>
                    Update Tests
                </Button>
            }
            </React.Fragment>
        );
    }
};