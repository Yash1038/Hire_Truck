import * as React from "react";
import NavbarTruck from "../navbars/navbarTruck";
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
    // height: "970px",
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

export default function AcceptedFreight(props) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/acceptedquotes");
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
  const [pair, setPair] = React.useState([]);
  const [load, setload] = React.useState(false);
  const [Rfreights, setRfreights] = React.useState([]);
  let Rf = [];
  const freight_owner_username = props.userName;
  //   console.log(freight_owner_username);

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
    // console.log(token);
    // axios
    //   .post(
    //     "http://localhost:4003/user/get_trucks",
    //     {},
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         authorization: `Bearer:${token}`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     setButtonLoading(false);
    //     // console.log("bhadav", res.data.subarray);
    //     // setload(1);
    //     settruckdetails(res.data.subarray);
    //     // console.log(res.data.subarray)
    //   })
    //   .catch((error, res) => {
    //     setButtonLoading(false);
    //     if (error.response.request.status == 401) {
    //       alert("Unauthorized User! Kindly Login!");
    //       props.JwtState(false);
    //     } else {
    //       alert(error.response.data.message);
    //     }
    //   });
    // axios
    //   .post(
    //     "http://localhost:4003/user/accepted_details",
    //     {},
    //     {
    //         headers: {
    //           "Content-Type": "application/json",
    //           authorization: `Bearer:${token}`,
    //         },
    //     }
    //   )
    //   .then((res) => {
    //     setButtonLoading(false);
    //     // console.log("bhadav", res.data.subarray);
    //     setPair(res.data);
    //     // console.log(res.data);
    //     // settruckdetails(res.data.subarray);
    //     // console.log(res.data.subarray)
    //   })
    //   .catch((error, res) => {
    //     setButtonLoading(false);
    //     if (error.response.request.status == 401) {
    //       alert("Unauthorized User! Kindly Login!");
    //       props.JwtState(false);
    //     } else {
    //       alert(error.response.data.message);
    //     }
    //   });
  }, []);

  //   const handlefreight = async (event) => {
  React.useEffect(() => {
    // const token = localStorage["userToken"] ;
    axios
      .post(
        "http://localhost:4003/user/temp2",
        {
          status: "1",
          //   freight_id: event.freight_id,
          //   truck_id: event.truck_id,
          userName: props.userName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${localStorage["userToken"] + "456"}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        // Rf.push(res.data)
        setRfreights(res.data);
        setload(true);
        // console.log(Rfreights);
        // setDisplayData([]);
        // setDataChange1(!dataChange1);
      })
      .catch((err) => {
        if (err.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          // alert(err.response.data.message);
          alert("errorrrrrrrrrr");
        }
      });
  }, []);
  //   };

  // console.log("Finisheddd")

  // var strheight;
  // // var objs = tickets.length;
  // var size_box = 1000 + objs * 400;
  // size_box += 100;
  // strheight = size_box + "px";

  return load ? (
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
              Accepted Freights Quotes Details
            </div>
            {/* {console.log(Rfreights)} */}

            {Rfreights.subarray_f.map((e, i) => {
              // e has truck details
              // to get freight details, Rfreights.subarray_f[i].whatveryouwant
              // to get truck detals, simply e.whatever you want
              //   handlefreight(e);
              console.log("here:", e);
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
                    {e.dateOfShippment}
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
                    {Rfreights.subarray_f[i].dateOfShippment}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Truck Load Type: </span>{" "}
                    {Rfreights.subarray_f[i].load_types_handled}
                  </div>
                  <div className={classes.truckBoxText}></div>
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
