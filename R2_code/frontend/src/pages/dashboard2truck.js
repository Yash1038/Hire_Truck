import * as React from "react";
import NavbarTruck from "../navbars/navbarTruck";
import { Modal } from "@mui/material";
import { Backdrop } from "@mui/material";
import { Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../App.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  overall: {
    backgroundColor: "lightcyan",
    height: "100%",
    width: "100%",
    overflow: "scroll",
    position: "absolute",
  },
  truckBox: {
    backgroundColor: "lightyellow",
    height: "570px",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    marginBottom: "16px",
    overflow: "hidden",
    position: "relative",
    // backgroundColor: 'lightyellow',
    transition: "box-shadow .3s ease-in-out",
    "&:hover": {
      boxShadow: "0px 4px 20px -4px rgba(0,0,0,0.4)",
    },
  },
  truckBoxTitle: {
    fontWeight: "bold",
    fontSize: "35px",
    marginBottom: "5px",
  },
  truckBoxText: {
    color: "black",
    fontSize: "25px",
    marginBottom: "10px",
    lineHeight: "1.3",
  },
});

export default function Dashboard2Freight(props) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/dashboard2");
    }
  }, []);
  const classes = useStyles();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 800,
    width: 1050,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    overflow: "scroll",
    p: 4,
    // backgroundColor:"skyblue",
  };

  const [isButtonLoading, setButtonLoading] = React.useState(false);
  // const [tickets, setTickets] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [freightdetails, setfreightdetails] = React.useState([]);
  const [load, setload] = React.useState(0);

  console.log(props);
  const truck_owner_username = props.userName;
  console.log("username:aaaaa ", props.userName);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const token = localStorage["userToken"] + "456";
    console.log(token)
    axios
      .post("http://localhost:4003/user/get_freights", {},{
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer:${token}`,
        },
      })
      .then((res) => {

        setButtonLoading(false);
        // console.log("bhadav", res.data.subarray);
        setload(1);
        setfreightdetails(res.data.subarray);
        // console.log(res.data.subarray)
        
      })
      .catch((error, res) => {
        setButtonLoading(false);
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  }, []);

  async function handle_email (props){  

    alert("Email sent to Freight Owner!")
    const truckdata = { userName: truck_owner_username };
    const uril = "http://localhost:4003/user/extract_truck_owner_email";
    const tokenl = localStorage["userToken"] + "456";
    const responsel = await axios
    .post(uril, truckdata,{
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer:${tokenl}`,
      },
    })

    console.log("responsel : ",responsel);
    const companyName = responsel.data.companyName;
    const contact = responsel.data.contact;
    const source_address_pincode = props.source_address_pincode;
    const destination_address_pincode = props.destination_address_pincode;


    const username = props.username;
    const newdata = {
      userName: username,
    };
    const uri = "http://localhost:4003/user/extract_freight_owner_email";
    const token = localStorage["userToken"] + "456";

    const response = await axios
    .post(uri, newdata,{
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer:${token}`,
      },
    })

    const emnik = response.data.emailId;
    console.log(emnik);
    const tokens = localStorage["userToken"] + "456";
    try {
      await axios.post('http://localhost:4003/user/send-email', {
        blockedUserEmail: emnik,
        companyName: companyName,
        contact: contact,
        source_address_pincode: source_address_pincode,
        destination_address_pincode: destination_address_pincode,
      },{
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer:${tokens}`,
        },
      });
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.post('http://localhost:4003/user/store_quote', {
        freight_id : props._id,
        truck_owner_username : truck_owner_username,
        freight_owner_username:props.username,
        status : "0",
        loadType : props.load_type,
        dateOfShippment : props.dateOfShippment,
        source_address : props.source_address,
        destination_address : props.destination_address,
        destination_address_pincode: props.destination_address_pincode,
        source_address_pincode: props.source_address_pincode,
      },{
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer:${tokens}`,
        },
      });
      console.log("lavde ka resp",response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    (load) ? (
      <>
      <div className={classes.overall}>
        <NavbarTruck setIsJwt={props.setIsJwt} setJwt={props.setJwt} />
        <div style={{ paddingTop: "70px" }}>
          <br />
          <br />
          <div>
            <div
              style={{
                fontWeight: "bolder",
                fontSize: "50px",
                marginLeft: "2.7%",
                textDecoration: "underline",
              }}
            >
              Freights Available
            </div>

            {freightdetails.map((e) => {
              return (
                <div
                  style={{
                    paddingTop: "50px",
                    marginLeft: "2%",
                    paddingRight: "2%",
                  }}
                >
                  <Box className={classes.truckBox}>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>Load Type:</span>{" "}
                      {e.load_type}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>Source Address</span>{" "}
                      {e.source_address}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>Destination Address</span>{" "}
                      {e.destination_address}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>Source Address Pincode</span>{" "}
                      {e.source_address_pincode}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                      Destination Address Pincode
                      </span>{" "}
                      {e.destination_address_pincode}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        Requested Quotes
                      </span>{" "}
                      {e.requested_quotes}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                      Recieved Quotes
                      </span>{" "}
                      {e.recieved_quotes}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                      Vehicle Req
                      </span>{" "}
                      {e.vehicle_req}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>Date Of Shipment of freight</span>{" "}
                      {e.dateOfShippment}
                    </div>
                    <div className={classes.truckBoxText}>
                      <Button
                        variant="contained"
                        onClick={() => handle_email(e)}
                        class="my-button"
                        style={{ display: "flex", textAlign: "center", margin: "auto" }}
                      >
                        Send Quote
                      </Button>
                    </div>
                  </Box>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      </>
    ) : (<></>)
  ) 
}
