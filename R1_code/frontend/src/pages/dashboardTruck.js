import * as React from "react";
import NavbarDashboard from "../navbars/navbarDashboard";
import { Modal } from "@mui/material";
import { Backdrop } from "@mui/material";
import { Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import "../App.css";

import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  truckBox: {
    backgroundColor: "lightyellow",
    height: "390px",
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
  const [trucksListed, setTrucksListed] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [newVehicleData, setnewVehicleData] = React.useState({
    username: props.userName,
    vehicle_reg_no: "",
    vehicle_type: "",
    vehicle_reg_date: "",
    vehicle_age: "",
    vehicle_chassis_no: "",
    pollution_valid: "",
    insurance_validity_date: "",
    load_types_handled: "",
    regular_transport_route: "",
    max_volume: "",
    axle: "",
    transmission_type: "",
    vehicle_spec: "",
    max_layover: "",
    return_truck_load_offers: "",
    quotation_sent: "",
    booking_done: "",
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
    setnewVehicleData({
      ...newVehicleData,
      [event.target.name]: event.target.value,
    });
  };

  // console.log(props.userName);
  React.useEffect(() => {
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
        setTrucksListed(res.data);
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

  console.log("sidjx", trucksListed);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonLoading(true);

    const sData = JSON.stringify(newVehicleData);

    console.log(sData);

    axios
      .post("http://localhost:4003/user/add_truck_details", sData, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer:${props.jwt + "456"}`,
        },
      })
      .then((res) => {
        alert("Vehicle Added Successfully!");
        setButtonLoading(false);
        setTrucksListed([...trucksListed, res.data.user]);
      })
      .catch((error, res) => {
        setButtonLoading(false);
        if (error.response.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
    // setSubGreddiitData((prev) => templ);
  };

  // const classes = useStyles();

  var strheight;
  var objs = trucksListed.length;
  var size_box = 1000 + objs * 500;
  size_box += 100;
  strheight = size_box + "px";

  return (
    <div style={{ height: strheight, backgroundColor: "lightcyan" }}>
      <NavbarDashboard setIsJwt={props.setIsJwt} setJwt={props.setJwt} />
      <div style={{ paddingTop: "70px" }}>
        <Button
          variant="contained"
          onClick={handleClick}
          class="my-button"
          style={{ display: "flex", textAlign: "center", margin: "auto" }}
        >
          Add new vehicle
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
                Vehicle Registration Number:&nbsp;
                <input
                  className="modal-input"
                  name="vehicle_reg_no"
                  type="text"
                  value={newVehicleData.vehicle_reg_no}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Vehicle Type:&nbsp;
                <input
                  className="modal-input"
                  name="vehicle_type"
                  type="text"
                  value={newVehicleData.vehicle_type}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Source Address Pincode:&nbsp;
                <input
                  className="modal-input"
                  name="vehicle_reg_date"
                  type="text"
                  value={newVehicleData.vehicle_reg_date}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Destination Address Pincode:&nbsp;
                <input
                  className="modal-input"
                  name="vehicle_age"
                  value={newVehicleData.vehicle_age}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Vehicle Chassis Number:&nbsp;
                <input
                  className="modal-input"
                  name="vehicle_chassis_no"
                  type="text"
                  value={newVehicleData.vehicle_chassis_no}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Pollution Valid:&nbsp;
                <input
                  className="modal-input"
                  name="pollution_valid"
                  type="text"
                  value={newVehicleData.pollution_valid}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Load Types Handled:&nbsp;
                <input
                  className="modal-input"
                  name="load_types_handled"
                  type="text"
                  value={newVehicleData.load_types_handled}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Regular Transport Route:&nbsp;
                <input
                  className="modal-input"
                  name="regular_transport_route"
                  type="text"
                  value={newVehicleData.regular_transport_route}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Max Volume:&nbsp;
                <input
                  className="modal-input"
                  name="max_volume"
                  type="text"
                  value={newVehicleData.max_volume}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Axle:&nbsp;
                <input
                  className="modal-input"
                  name="axle"
                  type="text"
                  value={newVehicleData.axle}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Transmission Type:&nbsp;
                <input
                  className="modal-input"
                  name="transmission_type"
                  type="text"
                  value={newVehicleData.transmission_type}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Insurance Validity Date:&nbsp;
                <input
                  className="modal-input"
                  name="insurance_validity_date"
                  type="text"
                  value={newVehicleData.insurance_validity_date}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Vehicle Spec:&nbsp;
                <input
                  className="modal-input"
                  name="vehicle_spec"
                  type="text"
                  value={newVehicleData.vehicle_spec}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Max Layover:&nbsp;
                <input
                  className="modal-input"
                  name="max_layover"
                  type="text"
                  value={newVehicleData.max_layover}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Return Truck Load Offers:&nbsp;
                <input
                  className="modal-input"
                  name="return_truck_load_offers"
                  type="text"
                  value={newVehicleData.return_truck_load_offers}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Quotation Sent:&nbsp;
                <input
                  className="modal-input"
                  name="quotation_sent"
                  type="text"
                  value={newVehicleData.quotation_sent}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label className="alignsame">
                Booking Done:&nbsp;
                <input
                  className="modal-input"
                  name="booking_done"
                  type="text"
                  value={newVehicleData.booking_done}
                  onChange={handleChange}
                />
              </label>
              {/* <br /> */}
              {isButtonLoading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </div>
              ) : (
                <input
                  disabled={
                    newVehicleData.loadType === "" || newVehicleData.date === ""
                  }
                  type="submit"
                  value="Submit"
                  className="sub"
                  onClick={handleSubmit}
                  style={{
                    backgroundColor:
                      newVehicleData.loadType === "" ||
                      newVehicleData.date === ""
                        ? "red"
                        : "pink",
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
            Currently Listed Trucks:
          </div>
          {trucksListed.map((truckD, ind) => {
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
                    <span style={{ fontWeight: "bold" }}>
                      RegistrationNumber:
                    </span>{" "}
                    {truckD.vehicle_reg_no}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Vehicle Type:</span>{" "}
                    {truckD.vehicle_type}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Load Type:</span>{" "}
                    {truckD.load_types_handled}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Pollution:</span>{" "}
                    {truckD.pollution_valid}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Insurance Date Expiry:
                    </span>{" "}
                    {truckD.insurance_validity_date}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Return Truck Load Offers:
                    </span>{" "}
                    {truckD.return_truck_load_offers}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Quotation Sent:</span>{" "}
                    {truckD.quotation_sent}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Booking Done:</span>{" "}
                    {truckD.booking_done}
                  </div>
                </Box>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
