import * as React from "react";
import NavbarFreight from "../navbars/navbarFreight";
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
    height: "500px",
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
    height: "480px",
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

  // const [buttonLoading, setButtonLoading] = React.useState(false);
  const [FreightsListed, setFreightsListed] = React.useState([]);
  const [TruckData, setTruckData] = React.useState([]);
  const [displayData, setDisplayData] = React.useState([]);
  // const [dataChange1, setDataChange1] = React.useState(false);
  const [dataChange2, setDataChange2] = React.useState(false);
  const [distance, setDistance] = React.useState(0);
  const [dataChange, setDataChange] = React.useState(true);

  React.useEffect(() => {
    // setButtonLoading(true);
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
        console.log("res.data: ",res.data)
        setFreightsListed(res.data);
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
          .then((ress) => {
            setTruckData(ress.data.subarray);
            // setButtonLoading(false);
            setDataChange2(!dataChange2);
            setDataChange(!dataChange);
          })
          .catch((errr) => {
            // setButtonLoading(false);
            if (errr.response.request.status == 401) {
              alert("Unauthorized User! Kindly Login 501!");
              props.JwtState(false);
            } else {
              alert(errr.response.data.message);
            }
          });
      })
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login 510!");
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
    console.log("FreightsListed", FreightsListed);
    for (var i = 0; i < FreightsListed.length; i++) {
      console.log(FreightsListed[i]);
      const filteredTruck = TruckData.filter(function (truckForFreight) {
        return truckForFreight.load_types_handled == FreightsListed[i].load_type;
      });

      console.log(filteredTruck);

      const sortedFreight = filteredTruck.sort((a, b) => {
        const dateDiffA = Math.abs(
          new Date(a.dateOfShippment) -
            new Date(FreightsListed[i].dateOfShippment)
        );
        const dateDiffB = Math.abs(
          new Date(a.dateOfShippment) -
            new Date(FreightsListed[i].dateOfShippment)
        );
        return dateDiffA - dateDiffB;
      });

      console.log("sortedfreights: ",sortedFreight);

      const calculateDistances = async (truckForFreight) => {
        console.log(truckForFreight);
        const sourceDist = await get_val(
          FreightsListed[i].source_address,
          truckForFreight.source_address
        );
        const destDist = await get_val(
          FreightsListed[i].destination_address,
          truckForFreight.destination_address
        );
        console.log("distancesum: ", sourceDist + destDist);
        return { ...truckForFreight, distance: Math.round(sourceDist + destDist), freight: FreightsListed[i]};
      };

      const distances = [];

      for (var i = 0; i < sortedFreight.length; i++) {
        const val = await calculateDistances(sortedFreight[i]);
        console.log("val is ", val);
        distances.push(val);
      }

      const sortedDistances = distances.sort((a, b) => a.distance - b.distance);

      const bestTruck = sortedDistances[0];

      console.log("best freight is :",bestTruck);

      // Swayam...take the relevant data for each match that you want to display and then you can simply display it
      const data_match = bestTruck;

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

  const freight_owner_username = props.userName;

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
                  <Box className={classes.truckBox2} style={{ flex: "1"}}>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" , textDecoration:"underline"}}>
                      Freight Details:
                    </span>{" "}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Freight Shipment Date:
                    </span>{" "}
                    {e.freight.dateOfShippment}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Freight Source Address:</span>{" "}
                    {e.freight.source_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Freight Source Address Pincode:</span>{" "}
                    {e.freight.source_address_pincode}
                  </div>    
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Freight Destination Address:
                    </span>{" "}
                    {e.freight.destination_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Freight Destination Address Pincode:
                    </span>{" "}
                    {e.freight.destination_address_pincode}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      No Of Vehicles Required:
                    </span>{" "}
                    {e.freight.vehicle_req}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Load Type: </span>{" "}
                    {e.freight.load_type}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Heuristic: </span>{" "}
                    {e.distance} kms
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
                <Box className={classes.truckBox} style={{ flex: "1", borderLeft: "1px solid black", paddingLeft: "50px" }}>
                  <br/>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold", textDecoration:"underline" }}>
                    Truck Details:
                    </span>{" "}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Truck Owner Name:
                    </span>{" "}
                    {e.username}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Registration Number:
                    </span>{" "}
                    {e.vehicle_reg_no}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Shipment Date:
                    </span>{" "}
                    {e.dateOfShippment}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Source Address:
                    </span>{" "}
                    {e.source_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Source Address Pincode:
                    </span>{" "}
                    {e.source_address_pincode}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Destination Address:
                    </span>{" "}
                    {e.destination_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Vehicle Destination Address Pincode:
                    </span>{" "}
                    {e.destination_address_pincode}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Quotations Sent:
                    </span>{" "}
                    {e.quotation_sent}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Load Types Handled:
                    </span>{" "}
                    {e.load_types_handled}
                  </div>
                  </Box>
                  <br/>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
