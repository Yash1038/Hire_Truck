import * as React from "react";
import NavbarFreight from "../navbars/navbarFreight";
import { Modal } from "@mui/material";
import { Backdrop } from "@mui/material";
import { Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../App.css";

import { makeStyles } from "@material-ui/core/styles";
// import truck_details from "../../../backend/models/truck_details";

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
    height: "1070px",
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
  const [truckdetails, settruckdetails] = React.useState([]);
  const [load, setload] = React.useState(0);

  const freight_owner_username = props.userName;
  console.log(freight_owner_username);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const token = localStorage["userToken"] + "123";
    console.log(token);
    axios
      .post(
        "http://localhost:4003/user/get_trucks",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${token}`,
          },
        }
      )
      .then((res) => {
        setButtonLoading(false);
        // console.log("bhadav", res.data.subarray);
        setload(1);
        settruckdetails(res.data.subarray);
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

  async function handle_email(props) {
    console.log("propsssss",props);

    alert("Email sent to the truck owner!")

    const freightdata = { userName: freight_owner_username };
    const truck_owner_username = props.username;
    const uril = "http://localhost:4003/user/extract_freight_owner_email";
    const tokenl = localStorage["userToken"] + "123";
    // console.log("truck",freightdata)
    const responsel = await axios.post(uril, freightdata, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer:${tokenl}`,
      },
    });
    // console.log("dokvfodsjvosjs")

    console.log("responsel : ", responsel);
    const companyName = responsel.data.companyName;
    const contact = responsel.data.contact;
    const load_types_handled = props.load_types_handled;
    const regular_transport_route = props.regular_transport_route;
    const max_layover = props.max_layover;
    const max_volume = props.max_volume;
    const vehicle_type = props.vehicle_type;
    const vehicle_reg_no = props.vehicle_reg_no;

    const username = props.username;
    const newdata = {
      userName: username,
    };

    const uri = "http://localhost:4003/user/extract_truck_owner_email";
    const token = localStorage["userToken"] + "123";

    const response = await axios.post(uri, newdata, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer:${token}`,
      },
    });

    const emnik = response.data.emailId;
    console.log(emnik);
    const tokens = localStorage["userToken"] + "123";
    try {
      await axios.post(
        "http://localhost:4003/user/send-email-freight",
        {
          blockedUserEmail: emnik,
          companyName: companyName,
          contact: contact,
          load_types_handled: load_types_handled,
          regular_transport_route: regular_transport_route,
          max_layover: max_layover,
          max_volume: max_volume,
          vehicle_type: vehicle_type,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${tokens}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.post(
        "http://localhost:4003/user/store_quote_request",
        {
          truck_id: props._id,
          freight_owner_username: freight_owner_username,
          truck_owner_username: truck_owner_username,
          status: "0",
          load_types_handled: props.load_types_handled,
          vehicle_type: props.vehicle_type,
          max_volume: props.max_volume,
          max_layover: props.max_layover,
          regular_transport_route: props.regular_transport_route,
          source_address: props.source_address,
          destination_address: props.destination_address,
          source_address_pincode: props.source_address_pincode,
          destination_address_pincode: props.destination_address_pincode,
          vehicle_reg_no: props.vehicle_reg_no,
          dateOfShippment: props.dateOfShippment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${tokens}`,
          },
        }
      );
      console.log("respo", response.data);
    } catch (error) {
      console.error(error);
    }

    // console.log("Finisheddd")
  }

  // var strheight;
  // // var objs = tickets.length;
  // var size_box = 1000 + objs * 400;
  // size_box += 100;
  // strheight = size_box + "px";

  return load ? (
    <>
      <div className={classes.overall}>
        <NavbarFreight setIsJwt={props.setIsJwt} setJwt={props.setJwt} />
        <div style={{ paddingTop: "70px" }}>
          {/* <Button
          variant="contained"
          onClick={handleClick}
          class="my-button"
          style={{ display: "flex", textAlign: "center", margin: "auto" }}
        >
          New Ticket
        </Button> */}
          {/* <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
          </Modal> */}
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
              Trucks Available
            </div>

            {truckdetails.map((e) => {
              return (
                <div
                  style={{
                    paddingTop: "50px",
                    marginLeft: "2%",
                    paddingRight: "2%",
                  }}
                >
                  {/* <div
                  style={{
                    paddingTop: "50px",
                    marginLeft: "2%",
                    paddingRight: "2%",
                  }}
                > */}

                  <Box className={classes.truckBox}>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        Vehicle Reg No:
                      </span>{" "}
                      {e.vehicle_reg_no}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>vehicle type</span>{" "}
                      {e.vehicle_type}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        Vehicle Reg Date:
                      </span>{" "}
                      {e.vehicle_reg_date}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>vehicle age:</span>{" "}
                      {e.vehicle_age}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        vehicle chassis no
                      </span>{" "}
                      {e.vehicle_chassis_no}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>Polution Valid</span>{" "}
                      {e.pollution_valid}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        insurance validity date
                      </span>{" "}
                      {e.insurance_validity_date}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        Load Types Handled
                      </span>{" "}
                      {e.load_types_handled}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        regular transport route
                      </span>{" "}
                      {e.regular_transport_route}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>Max Volume </span>{" "}
                      {e.max_volume}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}> Axle</span> {e.axle}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        transmission type{" "}
                      </span>{" "}
                      {e.transmission_type}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}> Vehicle Spec</span>{" "}
                      {e.vehicle_spec}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}> Max Layover</span>{" "}
                      {e.max_layover}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        {" "}
                        Return Truck Load Offers
                      </span>{" "}
                      {e.return_truck_load_offers}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}>
                        {" "}
                        Quotation sent
                      </span>{" "}
                      {e.quotation_sent}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}> Booking Done</span>{" "}
                      {e.booking_done}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}> Source Address</span>{" "}
                      {e.source_address}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}> Destination Address</span>{" "}
                      {e.destination_address}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}> Source Address Pincode</span>{" "}
                      {e.source_address_pincode}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}> Destination Address Pincode</span>{" "}
                      {e.destination_address_pincode}
                    </div>
                    <div className={classes.truckBoxText}>
                      <span style={{ fontWeight: "bold" }}> Date of Shippment</span>{" "}
                      {e.dateOfShippment}
                    </div>
                    <div className={classes.truckBoxText}>
                      <Button
                        variant="contained"
                        onClick={() => handle_email(e)}
                        class="my-button"
                        style={{
                          display: "flex",
                          textAlign: "center",
                          margin: "auto",
                        }}
                      >
                        Ask Quote
                      </Button>
                    </div>
                  </Box>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
