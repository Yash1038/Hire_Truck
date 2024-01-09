import * as React from "react";
import NavbarFreight from "../navbars/navbarFreight";
import { Modal } from "@mui/material";
import { Backdrop } from "@mui/material";
import { Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../App.css";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  overall: {
    // the CSS should be for entirety of the background as well as it should let me scroll for content
    backgroundColor: "lightcyan",
    height: "100%",
    width: "100%",
    overflow: "scroll",
    position: "absolute",
  },
  truckBox: {
    backgroundColor: "lightyellow",
    height: "470px",
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

export default function DashboardFreight(props) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/dashboard");
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
  const [tickets, setTickets] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [newTicketData, setNewTicketData] = React.useState({
    loadType: "",
    date: "",
    sourceAddress : "",
    destinationAddress : "",
    sourceAddressPincode: "",
    destinationAddressPincode: "",
    vehicleTypeRequired: "",
    noVehiclesRequired: "",
    loadAmt: "",
    requestedQuotes: "",
  });

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setNewTicketData({
      ...newTicketData,
      [event.target.name]: event.target.value,
    });
  };

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:4003/user/extract_freight_details",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${localStorage["userToken"] + "123"}`,
          },
        }
      )
      .then((res) => {
        console.log("difssjd0sp", res.data);
        setTickets(res.data);
      })
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(err.response.data.message);
        }
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonLoading(true);

    // checking if all the data fields are filled

    if (newTicketData.loadType == "" || newTicketData.date == "" || newTicketData.sourceAddress == "" || newTicketData.destinationAddress == "" || newTicketData.sourceAddressPincode == "" || newTicketData.destinationAddressPincode == "" || newTicketData.vehicleTypeRequired == "" || newTicketData.noVehiclesRequired == "" || newTicketData.loadAmt == "" || newTicketData.requestedQuotes == "") {
      alert("Please fill all the fields!");
      setButtonLoading(false);
      return;
    }

    if (newTicketData.sourceAddressPincode.length != 6) {
      alert("Source Pincode should be 6 digits!");
      setButtonLoading(false);
      return;
    }

    if (newTicketData.destinationAddressPincode.length != 6) {
      alert("Destination Pincode should be 6 digits!");
      setButtonLoading(false);
      return;
    }

    if (newTicketData.requestedQuotes < 1) { 
      alert("Requested Quotes should be atleast 1!");
      setButtonLoading(false);
      return;
    }

    if (newTicketData.noVehiclesRequired < 1) {
      alert("No. of Vehicles Required should be atleast 1!");
      setButtonLoading(false);
      return;
    }

    const ticketObj = {
      username: props.userName,
      load_type: newTicketData.loadType,
      source_address: newTicketData.sourceAddress,
      destination_address: newTicketData.destinationAddress,
      source_address_pincode: newTicketData.sourceAddressPincode,
      destination_address_pincode: newTicketData.destinationAddressPincode,
      requested_quotes: newTicketData.requestedQuotes,
      recieved_quotes: "0",
      vehicle_req: newTicketData.noVehiclesRequired,
      dateOfShippment: newTicketData.date,
    };

    const sData = JSON.stringify(ticketObj);

    console.log(sData);

    axios
      .post("http://localhost:4003/user/add_freight_details", sData, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer:${localStorage["userToken"] + "123"}`,
        },
      })
      .then((res) => {
        alert("Ticket Created Successfully!");
        setButtonLoading(false);
        console.log("bhadav", res.data.user);
        setTickets([...tickets, res.data.user]);
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
    // setSubGreddiitData((prev) => templ);
  };

  var strheight;
  var objs = tickets.length;
  var size_box = 1000 + objs * 400;
  size_box += 100;
  strheight = size_box + "px";

  return (
    <div className={classes.overall}>
      <NavbarFreight setIsJwt={props.setIsJwt} setJwt={props.setJwt} />
      <div style={{ paddingTop: "70px" }}>
        <Button
          variant="contained"
          onClick={handleClick}
          class="my-button"
          style={{ display: "flex", textAlign: "center", margin: "auto" }}
        >
          New Ticket
        </Button>
        <Modal
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
          <Box sx={style}>
            <form className="fm">
              {" "}
              <label className="alignsame">
                Load Type:&nbsp;
                <input
                  className="modal-input"
                  name="loadType"
                  type="text"
                  required
                  value={newTicketData.loadType}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Pick-up Date:&nbsp;
                <input
                  className="modal-input"
                  name="date"
                  type="date"
                  required
                  value={newTicketData.date}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Source Address:&nbsp;
                <input
                  className="modal-input"
                  name="sourceAddress"
                  type="text"
                  required
                  value={newTicketData.sourceAddress}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Destination Address:&nbsp;
                <input
                  className="modal-input"
                  name="destinationAddress"
                  type="text"
                  required
                  value={newTicketData.destinationAddress}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Source Address Pincode:&nbsp;
                <input
                  className="modal-input"
                  name="sourceAddressPincode"
                  type="number"
                  required
                  value={newTicketData.sourceAddressPincode}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Destination Address Pincode:&nbsp;
                <input
                  className="modal-input"
                  name="destinationAddressPincode"
                  type="number"
                  required
                  value={newTicketData.destinationAddressPincode}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Vehicle Type Required:&nbsp;
                <input
                  className="modal-input"
                  name="vehicleTypeRequired"
                  type="text"
                  value={newTicketData.vehicleTypeRequired}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                No Of Vehicles Required:&nbsp;
                <input
                  className="modal-input"
                  name="noVehiclesRequired"
                  type="number"
                  required
                  value={newTicketData.noVehiclesRequired}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Load Amt (in kgs./lts.):&nbsp;
                <input
                  className="modal-input"
                  name="loadAmt"
                  type="number"
                  required
                  value={newTicketData.loadAmt}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Quotes Required:&nbsp;
                <input
                  className="modal-input"
                  name="requestedQuotes"
                  type="number"
                  required
                  value={newTicketData.requestedQuotes}
                  onChange={handleChange}
                />
              </label>
              <br />
              {isButtonLoading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </div>
              ) : (
                <input
                  disabled={
                    newTicketData.loadType === "" || newTicketData.date === ""
                  }
                  type="submit"
                  value="Submit"
                  className="sub"
                  onClick={handleSubmit}
                  style={{
                    backgroundColor:
                      newTicketData.loadType === "" || newTicketData.date === ""
                        ? "red"
                        : "",
                    fontSize: "25px",
                    color: "black",
                    height: "45px",
                    width: "150px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                />
              )}
            </form>
          </Box>
        </Modal>
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
            Currently Listed Tickets:
          </div>

          {tickets.map((ticketD, ind) => {
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
                    <span style={{ fontWeight: "bold" }}>Loads:</span>{" "}
                    {ticketD.load_type}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
                    {ticketD.dateOfShippment}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Source Address:
                    </span>{" "}
                    {ticketD.source_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Destination Address:
                    </span>{" "}
                    {ticketD.destination_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Source Address Pincode:
                    </span>{" "}
                    {ticketD.source_address_pincode}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Destination Address Pincode:
                    </span>{" "}
                    {ticketD.destination_address_pincode}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Requested Quotes:
                    </span>{" "}
                    {ticketD.requested_quotes}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Received Quotes:</span>{" "}
                    {ticketD.recieved_quotes}
                  </div>
                </Box>

                {/* </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
