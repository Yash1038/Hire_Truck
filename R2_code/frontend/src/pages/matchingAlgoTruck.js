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
  truckBox2: {
    backgroundColor: "lightyellow",
    height: "450px",
    padding: "27px",
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

export default function MatchTruck(props) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/search");
    }
  }, []);

  // const [selectedQuote, setSelectedQuote] = React.useState(null);

  const classes = useStyles();

  // const style = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  //   height: 800,
  //   width: 1050,
  //   bgcolor: "background.paper",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  //   overflow: "scroll",
  //   p: 4,
  // };

  // const [buttonLoading, setButtonLoading] = React.useState(false);
  const [trucksListed, setTrucksListed] = React.useState([]);
  const [freightData, setFreightData] = React.useState([]);
  const [displayData, setDisplayData] = React.useState([]);
  // const [dataChange1, setDataChange1] = React.useState(false);
  const [dataChange2, setDataChange2] = React.useState(false);
  const [distance, setDistance] = React.useState(0);
  const [dataChange, setDataChange] = React.useState(true);

  React.useEffect(() => {
    // setButtonLoading(true);
    axios
      .post(
        "http://localhost:4003/user/extract_truck_details",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${localStorage["userToken"] + "456"}`,
          },
        }
      )
      .then((res) => {
        console.log("res.data: ",res.data)
        setTrucksListed(res.data);
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
          .then((ress) => {
            setFreightData(ress.data.subarray);
            // setButtonLoading(false);
            setDataChange2(!dataChange2);
            setDataChange(!dataChange);
          })
          .catch((errr) => {
            // setButtonLoading(false);
            if (errr.response.request.status == 401) {
              alert("Unauthorized User! Kindly Login!");
              props.JwtState(false);
            } else {
              alert(errr.response.data.message);
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
    // setButtonLoading(false);
  }, [dataChange2]);

  var strheight;

  async function distanceMatrix() {
    console.log("truckslisted", trucksListed);
    for (var i = 0; i < trucksListed.length; i++) {
      console.log(trucksListed[i]);
      const filteredFreight = freightData.filter(function (freightForTruck) {
        return freightForTruck.load_type == trucksListed[i].load_types_handled;
      });

      console.log(filteredFreight);

      const sortedFreight = filteredFreight.sort((a, b) => {
        const dateDiffA = Math.abs(
          new Date(a.dateOfShippment) -
            new Date(trucksListed[i].dateOfShippment)
        );
        const dateDiffB = Math.abs(
          new Date(a.dateOfShippment) -
            new Date(trucksListed[i].dateOfShippment)
        );
        return dateDiffA - dateDiffB;
      });

      console.log("sortedfreights: ",sortedFreight);

      const calculateDistances = async (freightForTruck) => {
        console.log(freightForTruck);
        const sourceDist = await get_val(
          trucksListed[i].source_address,
          freightForTruck.source_address
        );
        const destDist = await get_val(
          trucksListed[i].destination_address,
          freightForTruck.destination_address
        );
        console.log("distancesum: ", sourceDist + destDist);
        return { ...freightForTruck, distance: Math.round(sourceDist + destDist), truck: trucksListed[i]};
      };

      const distances = [];

      for (var i = 0; i < sortedFreight.length; i++) {
        const val = await calculateDistances(sortedFreight[i]);
        console.log("val is ", val);
        distances.push(val);
      }

      const sortedDistances = distances.sort((a, b) => a.distance - b.distance);

      const bestFreight = sortedDistances[0];

      console.log("best freight is :",bestFreight);

      // Swayam...take the relevant data for each match that you want to display and then you can simply display it
      const data_match = bestFreight;

      setDisplayData((prev) => [...prev, data_match]);
      console.log("inside: ",displayData);
    }
  }

  console.log("dispD", displayData);

  async function callDist() {
    await distanceMatrix();
  }

  React.useEffect(() => {
    callDist();
  }, [dataChange]);

  async function get_val(source, destination) {
    const res = await fetch(`https://geocode.maps.co/search?q={${source}}`, {
      method: "GET",
    });
    const resp = await res.json();

    const res2 = await fetch(
      `https://geocode.maps.co/search?q={${destination}}`,
      {
        method: "GET",
      }
    );

    const resp2 = await res2.json();

    const res3 = await fetch(
      `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${resp[0].lat},${resp[0].lon}&destinations=${resp2[0].lat},${resp2[0].lon}&travelMode=driving&key=Ai1TzwjShWGCR98HfRW_6gRDbEJfescVr3DBRwpRkmsnHm0ZiJYgDbnSyqsUGKe_`,
      {
        method: "GET",
      }
    );
    const resp3 = await res3.json();
    console.log(
      "dist",
      resp3.resourceSets[0].resources[0].results[0].travelDistance
    );
    setDistance(resp3.resourceSets[0].resources[0].results[0].travelDistance);

    // setButtonLoading(true);

    console.log("exit");
    console.log(distance);

    return resp3.resourceSets[0].resources[0].results[0].travelDistance;
  }

  const truck_owner_username = props.userName;

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
          Best Matches based on load type, date of shipment and distance covered optimum matching
        </div>
        {0 ? (
          console.log("hello"),
          <></>
        ) : (
          displayData.map((e) => {
            console.log(e)
            return (
              <div
                style={{
                  paddingTop: "50px",
                  marginLeft: "2%",
                  paddingRight: "2%",
                  display: "flex",
                  justifyContent: "space-between",
                  height: "300px",
                }}
              >
                <Box className={classes.truckBox} style={{ flex: "1" }}>
                  <br/>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold", textDecoration:"underline" }}>
                    Truck Details:
                    </span>{" "}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Registration Number:
                    </span>{" "}
                    {e.truck.vehicle_reg_no}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Shipment Date:
                    </span>{" "}
                    {e.truck.dateOfShippment}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Source Address:
                    </span>{" "}
                    {e.truck.source_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Source Address Pincode:
                    </span>{" "}
                    {e.truck.source_address_pincode}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Destination Address:
                    </span>{" "}
                    {e.truck.destination_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Destination Address Pincode:
                    </span>{" "}
                    {e.truck.destination_address_pincode}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Quotations Sent:
                    </span>{" "}
                    {e.truck.quotation_sent}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Load Types Handled:
                    </span>{" "}
                    {e.truck.load_types_handled}
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
                  <br/>
                  <Box className={classes.truckBox2} style={{ flex: "1", borderLeft: "1px solid black", paddingLeft: "50px" }}>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" , textDecoration:"underline"}}>
                      Freight Details:
                    </span>{" "}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Freight Owner Name:
                    </span>{" "}
                    {e.username}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Freight Shipment Date:
                    </span>{" "}
                    {e.dateOfShippment}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Freight Source Address:</span>{" "}
                    {e.source_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Freight Source Address Pincode:</span>{" "}
                    {e.source_address_pincode}
                  </div>    
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Freight Destination Address:
                    </span>{" "}
                    {e.destination_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Freight Destination Address Pincode:
                    </span>{" "}
                    {e.destination_address_pincode}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      No Of Vehicles Required:
                    </span>{" "}
                    {e.vehicle_req}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Load Type: </span>{" "}
                    {e.load_type}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Heuristic: </span>{" "}
                    {e.distance} kms
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