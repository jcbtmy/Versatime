
import { makeStyles} from "@material-ui/core";



const useStyles = makeStyles(() => ({
    root: {
        width: '210mm',
        minHeight: '297mm',
        overflow: "hidden",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "white",
        display: "none",
    },

    notInvoice: {
        textAlign: "center",
        width: "100%",
    },

    header: {
        display:"flex",
        marginTop: 20,
        width: "100%",
    },

    footer: {
        marginTop: 20,
        bottom: 0,
        width:"100%",
        textAlign: "center",
    },
    contactInfo: {  
        alignSelf: "flex-start",
        display: "flex",
        flexDirection: "column",
        marginLeft: 25,
        gap: 7,
        "& div": {
            color: "#2e75b6"
        }
    },
    vLogo: {
        marginRight: "auto",
        marginLeft: 30,
        "& img":{
            width: 200,
            height: 150,
        }
    },
    packingSlipNumber : {
        marginLeft: "auto",
        textAlign:"right",
        display:"flex",
        flexDirection: "column",
        marginRight: 15,
        top: 0,
        "& div" :{
            fontSize: 20,
        }
    },

    locations: {
        marginTop: 50,
        display:"flex",
        justifyContent: "center",
        flexGrow: 1, 
        marginLeft: 15,
        marginRight: 15,
        gap: 160,

    },

    locationChild: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
    },

    shipmentDetails : {
        marginTop: 25,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 25,
        paddingTop: 20,
        paddingBottom: 20,
        borderTop: "1px solid #E0E0E0",
        borderBottom: "1px solid #E0E0E0",
        alignItems:"center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },

    shipmentDetailsRow: {
        display: "flex",
        gap: 20,
        "& div" : {
            padding: 4,
            width: 150,
        },
        "& div > b": {
            textDecoration: "underline",
        }
    },

    table: {
        width:"90%",
        tableLayout: "fixed",
        marginLeft:"auto",
        marginRight: "auto",
        textAlign: "center",
        "& tr": {
            borderBottom: '1px solid black',
            padding: "3px 0px 3px 0px",
        }
    },

    tableHeadRow: {
        width: "100%",
        color: "white",
        backgroundColor: '#9dc3e6',
        textAlign: "center",
    }


}));


export default function ShippingPrintSheet(props){

    const classes = useStyles();
    const packingSlips = props.packingSlips;
    const shipDate = new Date();
    const slipIdx = props.slipIndex;

    let totalQuantity = 0;

    packingSlips[slipIdx].items.map((item) => totalQuantity += item.quantity);
    packingSlips[slipIdx].returnedItems.map((item) => totalQuantity += item.quantity)


    return(
        <div id="printSheet" className={classes.root}>
            <div className={classes.notInvoice}>THIS IS NOT AN INVOICE</div>
            <div className={classes.header}>
                <div className={classes.contactInfo}>
                    <div style={{fontSize: 23}}>Versacall Technologies Inc.</div>
                    <div>7047 Carroll Rd.</div>
                    <div>San Diego, CA USA 92121</div>
                    <div>Phone: 858-677-6766</div>
                    <div>Fax: 858-677-6765</div>
                    <div>Versacall.com</div>
                </div>
                <div className={classes.vLogo}>
                    <img src="/VersaCallImage.png" alt="VersaCall"></img>
                </div>
                <div className={classes.packingSlipNumber}>
                    <div>
                        Packing Slip
                    </div>
                    <div>
                        {packingSlips[slipIdx].packingSlipNumber}
                    </div>
                </div>
            </div>
            <div className={classes.locations}>
                <div className={classes.locationChild}>
                    <b style={{fontSize: 16, textDecoration: "underline"}}>Ship To: </b>
                    {
                        props.shipTo.split("\n").map((item) => <div>{item}</div>)
                    }
                </div>
                <div className={classes.locationChild}>
                    <b style={{fontSize: 16, textDecoration: "underline"}}>Customer:(if different)</b>
                    {
                        props.to.split("\n").map((item) => <div>{item}</div>)
                    }
                </div>
            </div>
            <div className={classes.shipmentDetails}>
                <div className={classes.shipmentDetailsRow}>
                    <div>
                        <div>
                            <b>Date Shipped</b>
                        </div>
                        <div>
                            {`${shipDate.getMonth() + 1}/${shipDate.getDate()}/${shipDate.getFullYear()}`}
                        </div>
                    </div>
                    <div>
                        <div>
                            <b>Date Ordered</b>
                        </div>
                        <div>
                            {`${props.orderDate.getMonth() + 1}/${props.orderDate.getDate()}/${props.orderDate.getFullYear()}`}
                        </div>
                    </div>
                    <div>
                        <div>
                            <b>Shippment Service</b>
                        </div>
                        <div>
                            {packingSlips[slipIdx].shipmentService}
                        </div>
                    </div>
                    <div>
                        <div>
                            <b>Tracking Number</b>
                        </div>
                        <div>
                            {packingSlips[slipIdx].trackingNumber}
                        </div>
                    </div>
                </div>
                <div className={classes.shipmentDetailsRow}> 
                    <div>
                        <div>
                            <b>Package No.</b>
                        </div>
                        <div>
                            {packingSlips[slipIdx].boxNumber}
                        </div>
                    </div>
                    <div>
                        <div>
                            <b>Customer PO</b>
                        </div>
                        <div>
                            {packingSlips[slipIdx].customerPO}
                        </div>
                    </div>
                    <div>
                        <div>
                            <b>Order Type</b>
                        </div>
                        <div>
                            {packingSlips[slipIdx].orderNumber ? "Sales" : null}
                            {packingSlips[slipIdx].orderNumber && packingSlips[slipIdx].RMANumber ? "/" : null}
                            {packingSlips[slipIdx].RMANumber ? "RMA" : null}
                        </div>
                    </div>
                    <div>
                        <div>
                            <b>Order Number</b>
                        </div>
                        <div>
                            {packingSlips[slipIdx].orderNumber ? `SO#${packingSlips[slipIdx].orderNumber}`: null}
                            {packingSlips[slipIdx].orderNumber && packingSlips[slipIdx].RMANumber ? "/" : null}
                            {packingSlips[slipIdx].RMANumber ? `RMA#${packingSlips[slipIdx].RMANumber}` : null}
                        </div>
                    </div>
                </div>
            </div>
            <table className={classes.table}>
                <tr className={classes.tableHeadRow}>
                    <th style={{width: 75}}>Ordered</th>
                    <th style={{width: 75}}>Shipped</th>
                    <th style={{width: 150}}>Item</th>
                    <th style={{width: 250}}>Descriptor</th>
                </tr>
                {       
                        packingSlips[slipIdx].items.map((item) => {   
                           const ordered = (props.order) ? props.order.items.find(i => i.productId === item.productId) : null;
                           return  (
                                    <tr>
                                        <td>{(ordered) ? ordered.quantity : item.quantity}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.productId}</td>
                                        <td>{props.products.find(p => p.productId === item.productId).productName}</td>
                                    </tr>
                           );
                        })
                }
            </table>
            <div style={{ width: "100%", textAlign:"center", marginTop: 40,}}>
                <b>Customer Property Being Returned</b>
            </div>
            <table className={classes.table}>
                <tr className={classes.tableHeadRow}>
                        <th style={{width: 75}}>Ordered</th>
                        <th style={{width: 75}}>Shipped</th>
                        <th style={{width: 150}}>Item</th>
                        <th style={{width: 250}}>Descriptor</th>
                </tr>
                {       
                        packingSlips[slipIdx].returnedItems.map((item) => {
                           return  (
                                    <tr>
                                        <td></td>
                                        <td>{item.quantity}</td>
                                        <td>{item.productId}</td>
                                        <td>{props.products.find(p => p.productId === item.productId).productName}</td>
                                    </tr>
                           );
                        })
                }
            </table >
            <table style={{marginTop: 25, marginLeft: "5%"}}>
                <tr className={classes.tableHeadRow}>
                    <th style={{padding: "5px 10px 5px 10px"}}>Total Items Shipped</th>
                    <th style={{backgroundColor: "#E0E0E0", color: "black", padding: "5px 10px 5px 10px",}}>
                        {totalQuantity}
                    </th>
                </tr>
            </table>
            <div className={classes.footer}>
                <b>Thank you for your business with Versacall</b>
            </div>
        </div>
    );
} 