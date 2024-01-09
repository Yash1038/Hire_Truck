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
    backgroundColor: "lightcyan",
    height: "100%",
    width: "100%",
    overflow: "scroll",
    position: "absolute",
  },
  truckBox: {
    backgroundColor: "lightyellow",
    height: "860px",
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

export default function QuotesFreight(props) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/quoterequests");
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

  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [tickets, setTickets] = React.useState([]);
  const [quotes, setQuotes] = React.useState([]);
  const [truckData, setTruckData] = React.useState([]);
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
        "http://localhost:4003/user/get_quotes",
        { freight_owner_username: props.userName },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${localStorage["userToken"] + "123"}`,
          },
        }
      )
      .then((res) => {
        setQuotes(res.data);
        axios
          .post(
            "http://localhost:4003/user/get_trucks",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer:${localStorage["userToken"] + "123"}`,
              },
            }
          )
          .then((res) => {
            setTruckData(res.data.subarray);
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
    console.log(truckData.length, quotes.length);
    for (var i = 0; i < truckData.length; i++) {
      for (var j = 0; j < quotes.length; j++) {
        if (truckData[i].username === quotes[j].truck_owner_username) {
          const obj = {
            quote_id: quotes[j]._id,
            freight_id: quotes[j].freight_id,
            dateOfShippmentofFreight: quotes[j].dateOfShippment,
            loadtypeOfFreight: quotes[j].loadType,
            dateOfShippment: truckData[i].dateOfShippment,
            truck_id: truckData[i]._id,
            vehicle_capacity: truckData[i].max_volume,
            vehicle_type: truckData[i].load_types_handled,
            vehicle_load_types: truckData[i].load_types_handled,
            vehicle_reg_no: truckData[i].vehicle_reg_no,
            regular_transport_route: truckData[i].regular_transport_route,
            max_layover: truckData[i].max_layover,
            source_address: truckData[i].source_address,
            destination_address: truckData[i].destination_address,
          };
          setDisplayData((prev) => [...prev, obj]);
        }
      }
    }

    setButtonLoading(false);
  }, [dataChange2]);

  console.log(buttonLoading, displayData);

  console.log(quotes);
  console.log("trucks", truckData);

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
        "http://localhost:4003/user/update_quote",
        {
          status: "1",
          freight_id: event.freight_id,
          quote_id: event.quote_id,
          truck_id: event.truck_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${localStorage["userToken"] + "123"}`,
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
        "http://localhost:4003/user/update_quote",
        {
          status: "-1",
          freight_id: event.freight_id,
          quote_id: event.quote_id,
          truck_id: event.truck_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${localStorage["userToken"] + "123"}`,
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

  console.log("display data", displayData);

  return (
    <div className={classes.overall}>
      <NavbarFreight setIsJwt={props.setIsJwt} setJwt={props.setJwt} />
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
          Quotes Available
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
                    <span style={{ fontWeight: "bold" }}>Vehicle Reg No:</span>{" "}
                    {e.vehicle_reg_no}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Vehicle Type:</span>{" "}
                    {e.vehicle_type}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Load Types Handled:
                    </span>{" "}
                    {e.vehicle_load_types}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Regular Transport Route:
                    </span>{" "}
                    {e.regular_transport_route}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Max Volume:</span>{" "}
                    {e.vehicle_capacity}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}> Max Layover:</span>{" "}
                    {e.max_layover}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}> Source Address:</span>{" "}
                    {e.source_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}> Destination Address:</span>{" "}
                    {e.destination_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}> Date of Shipment of Truck:</span>{" "}
                    {e.dateOfShippment}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}> Date of Shipment of Freight:</span>{" "}
                    {e.dateOfShippmentofFreight}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}> Load Type of Freight:</span>{" "}
                    {e.loadtypeOfFreight}
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
    </div>
  );
}
