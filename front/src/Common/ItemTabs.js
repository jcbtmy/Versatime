import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';



export default function ItemTabs(props){
    
    return(
        <Paper square style={{width: "100%"}}>
            <Tabs
                value={props.value}
                indicatorColor="primary"
                textColor="primary"
                onChange={props.onChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                
            >
                
                {
                    props.tabLabels.length && 
                    props.tabLabels.map(
                        (item, i) => <Tab key={i} label={item} />
                    )
                }
            </Tabs>
        </Paper>
    );
}