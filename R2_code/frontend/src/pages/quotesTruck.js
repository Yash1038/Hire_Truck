import * as React from "react";
import NavbarTruck from "../navbars/navbarTruck";
import { Modal } from "@mui/material";
import { Backdrop } from "@mui/material";
import { Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RenderMap from "./renderMap";

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
    height: "750px",
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

export default function QuotesTruck(props) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/quoterequests");
    }
  }, []);

  const [selectedQuote, setSelectedQuote] = React.useState(null);

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

  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [quotes, setQuotes] = React.useState([]);
  const [tickets, setTickets] = React.useState([]);
  const [freightData, setFreightData] = React.useState([]);
  const [displayData, setDisplayData] = React.useState([]);
  const [dataChange1, setDataChange1] = React.useState(false);
  const [dataChange2, setDataChange2] = React.useState(false);

  React.useEffect(() => {
    setDataChange1(!dataChange1);
  }, []);

  React.useEffect(() => {
    setButtonLoading(true);
    axios
      .post(
        "http://localhost:4003/user/get_quote_requests",
        { truck_owner_username: props.userName },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${localStorage["userToken"] + "456"}`,
          },
        }
      )
      .then((res) => {
        console.log("quotes: ", res.data);
        setQuotes(res.data);
        axios
          .post(
            "http://localhost:4003/user/get_freights",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer:${localStorage["userToken"] + "456"}`,
              },
            }
          )
          .then((res) => {
            setFreightData(res.data.subarray);
            setButtonLoading(false);
            setDataChange2(!dataChange2);
          })
          .catch((err) => {
            if (err.response.request.status == 401) {
              alert("Unauthorized User! Kindly Login!");
              props.JwtState(false);
            } else {
              alert(err.response.data.message);
            }
          });
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

  React.useEffect(() => {
    for (var i = 0; i < freightData.length; i++) {
      for (var j = 0; j < quotes.length; j++) {
        if (freightData[i].username === quotes[j].freight_owner_username) {
          const obj = {
            quote_id: quotes[j]._id,
            truck_id: quotes[j].truck_id,
            freight_id: freightData[i]._id,
            shipment_date_truck: quotes[j].dateOfShippment,
            load_type_truck: quotes[j].load_types_handled,
            shipment_date: freightData[i].dateOfShippment,
            source_address: freightData[i].source_address,
            destination_address: freightData[i].destination_address,
            source_address_pincode: freightData[i].source_address_pincode,
            destination_address_pincode: freightData[i].destination_address_pincode,
            vehicles_req: freightData[i].vehicle_req,
            load_type: freightData[i].load_type,
            vehicle_reg_no: quotes[j].vehicle_reg_no,
          };
          setDisplayData((prev) => [...prev, obj]);
        }
      }
    }

    setButtonLoading(false);
  }, [dataChange2]);

  console.log(quotes);
  console.log("freights", freightData);

  const handleViewMap = async (quote) => {
    console.log("in handle view map");
    var source = quote.source_address;
    var destination = quote.destination_address;
    const addresses = [source, destination];
    const urlSearchParams = new URLSearchParams();
    addresses.forEach((address) => {
      urlSearchParams.append('addresses', address);
    });

    const queryString = urlSearchParams.toString();
    console.log(queryString);
    window.location.href = `/renderMap?${queryString}`;
  };

  const handleYes = async (event) => {
    axios
      .post(
        "http://localhost:4003/user/update_quote_req",
        {
          status: "1",
          freight_id: event.freight_id,
          quote_id: event.quote_id,
          truck_id: event.truck_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${localStorage["userToken"] + "456"}`,
          },
        }
      )
      .then((res) => {
        setDisplayData([]);
        setDataChange1(!dataChange1);
      })
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(err.response.data.message);
        }
      });
  };

  const handleNo = async (event) => {
    axios
      .post(
        "http://localhost:4003/user/update_quote_req",
        {
          status: "-1",
          freight_id: event.freight_id,
          quote_id: event.quote_id,
          truck_id: event.truck_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${localStorage["userToken"] + "456"}`,
          },
        }
      )
      .then((res) => {
        setDisplayData([]);
        setDataChange1(!dataChange1);
      })
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(err.response.data.message);
        }
      });
  };

  var strheight;
  var objs = tickets.length;
  var size_box = 1000 + objs * 400;
  size_box += 100;
  strheight = size_box + "px";

  console.log("displaydata" ,displayData);

  return (
    <div className={classes.overall}>
      <NavbarTruck setIsJwt={props.setIsJwt} setJwt={props.setJwt} />
      <div style={{ paddingTop: "70px" }}>
        <br />
        <br />
        <div
          style={{
            fontWeight: "bolder",
            fontSize: "50px",
            marginLeft: "2.7%",
            textDecoration: "underline",
          }}
        >
          Quotes Requested By Freight Owners
        </div>
        {buttonLoading ? (
          <></>
        ) : (
          displayData.map((e) => {
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
                    <span style={{ fontWeight: "bold" }}>Shipment Date of Freight:</span>{" "}
                    {e.shipment_date}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Source Address:</span>{" "}
                    {e.source_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Destination Address:
                    </span>{" "}
                    {e.destination_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      No Of Vehicles Required:
                    </span>{" "}
                    {e.vehicles_req}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Load Type: </span>{" "}
                    {e.load_type}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Vehicle Reg No: </span>{" "}
                    {e.vehicle_reg_no}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Truck Shipment Date: </span>{" "}
                    {e.shipment_date_truck}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Truck Load Type: </span>{" "}
                    {e.load_type_truck}
                  </div>
                  <div className={classes.truckBoxText}>
                    <Button
                      variant="contained"
                      onClick={() => handleViewMap(e)}
                      class="my-button"
                      style={{
                        display: "flex",
                        textAlign: "center",
                        margin: "auto",
                      }}
                    >
                      View on Map
                    </Button>
                    <br/>
                    <Button
                      variant="contained"
                      onClick={() => handleYes(e)}
                      class="my-button"
                      style={{
                        display: "flex",
                        textAlign: "center",
                        margin: "auto",
                      }}
                    >
                      ACCEPT
                    </Button>
                    <br />
                    <Button
                      variant="contained"
                      onClick={() => handleNo(e)}
                      class="my-button"
                      style={{
                        display: "flex",
                        paddingTop: "10px",
                        textAlign: "center",
                        margin: "auto",
                      }}
                    >
                      REJECT
                    </Button>
                  </div>
                </Box>
              </div>
            );
          })
        )}
      </div>
      {/* {selectedQuote && <RenderMap quote={selectedQuote} />} */}
    </div>
  );
}
