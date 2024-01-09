import * as React from "react";
import NavbarTruck from "../navbars/navbarTruck";
import { Modal } from "@mui/material";
import { Backdrop } from "@mui/material";
import { Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import "../App.css";
import "./dashboard.css"
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

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
    height: "490px",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    marginBottom: "16px",
    overflow: "hidden",
    position: "relative",
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
    source_address: "",
    destination_address: "",
    source_address_pincode: "",
    destination_address_pincode: "",
    dateOfShippment: "",
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonLoading(true);

    // Check if all data fields are filled

    if (
      newVehicleData.vehicle_reg_no == "" ||
      newVehicleData.vehicle_type == "" ||
      newVehicleData.vehicle_reg_date == "" ||
      newVehicleData.vehicle_age == "" ||
      newVehicleData.vehicle_chassis_no == "" ||
      newVehicleData.pollution_valid == "" ||
      newVehicleData.insurance_validity_date == "" ||
      newVehicleData.load_types_handled == "" ||
      newVehicleData.regular_transport_route == "" ||
      newVehicleData.max_volume == "" ||
      newVehicleData.axle == "" ||
      newVehicleData.transmission_type == "" ||
      newVehicleData.vehicle_spec == "" ||
      newVehicleData.max_layover == "" ||
      newVehicleData.return_truck_load_offers == "" ||
      newVehicleData.quotation_sent == "" ||
      newVehicleData.booking_done == "" ||
      newVehicleData.source_address == "" ||
      newVehicleData.destination_address == "" ||
      newVehicleData.source_address_pincode == "" ||
      newVehicleData.destination_address_pincode == "" ||
      newVehicleData.dateOfShippment == ""
    ) {
      alert("Please fill all the fields!");
      setButtonLoading(false);
      return;
    }

    if (newVehicleData.source_address_pincode.length != 6) {
      alert("Source Address Pincode should be of 6 digits!");
      setButtonLoading(false);
      return;
    }

    if (newVehicleData.destination_address_pincode.length != 6) {
      alert("Destination Address Pincode should be of 6 digits!");
      setButtonLoading(false);
      return;
    }

    if (newVehicleData.age < 0) {
      alert("Vehicle Age cannot be negative!");
      setButtonLoading(false);
      return;
    }

    if (newVehicleData.max_volume < 0) {
      alert("Max Volume cannot be negative!");
      setButtonLoading(false);
      return;
    }

    if (newVehicleData.max_layover < 0) {
      alert("Max Layover cannot be negative!");
      setButtonLoading(false);
      return;
    }

    if (newVehicleData.quotation_sent < 0) {
      alert("Quotation Sent cannot be negative!");
      setButtonLoading(false);
      return;
    }

    if (
      newVehicleData.pollution_valid.toLowerCase() != "yes" &&
      newVehicleData.pollution_valid.toLowerCase() != "no"
    ) {
      alert("Pollution Valid should be either Yes or No!");
      setButtonLoading(false);
      return;
    }

    const sData = JSON.stringify(newVehicleData);

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
  };

  var strheight;
  var objs = trucksListed.length;
  var size_box = 1000 + objs * 500;
  size_box += 100;
  strheight = size_box + "px";

  return (
    <div className={classes.overall}>
      <NavbarTruck setIsJwt={props.setIsJwt} setJwt={props.setJwt} />
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
          {/* <div class="card-deck">
            <div class="card">
              <img class="card-img-top" src="http://www.orseu-concours.com/451-615-thickbox/selor-test-de-raisonnement-abstrait-niveau-a.jpg" alt="Company logo"/>
                <div class="card-body">
                  <h5 class="card-title">Card title</h5>
                  <ul class="list-group">
                    <li class="list-group-item list-group-item-success"><i class="fa fa-briefcase" style="font-size:20px;"></i>   Company</li>
                    <li class="list-group-item list-group-item-success"><i class="fa fa-user" style="font-size:20px;"></i>   Role</li>
                    <li class="list-group-item list-group-item-success"><i class="fa fa-map-marker" style="font-size:20px;"></i>   Location</li>
                    <li class="list-group-item list-group-item-success"><i class="fa fa-clock-o" style="font-size:20px;"></i>   Duration</li>
                    <li class="list-group-item list-group-item-success"><i class="fa fa-inr" style="font-size:20px;"></i>   Cost</li>
                  </ul>

                </div>
                <div class="card-footer">
                  <button type="button" class="btn" id="left-panel-link" >Register</button>
                  <button type="button" class="btn" data-toggle="modal" data-target="#exampleModal1" id="right-panel-link">
                    Learn More
                  </button>
                </div>
            </div>
            </div> */}


            <Box sx={style}>
              <form className="fm" >
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
                  Vehicle Registration Date:&nbsp;
                  <input
                    className="modal-input"
                    name="vehicle_reg_date"
                    type="date"
                    // required
                    value={newVehicleData.vehicle_reg_date}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <label className="alignsame">
                  Vehicle Age:&nbsp;
                  <input
                    className="modal-input"
                    name="vehicle_age"
                    type="number"
                    // required
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
                    // required
                    value={newVehicleData.vehicle_chassis_no}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <label className="alignsame">
                  Pollution Valid (yes or no):&nbsp;
                  <input
                    className="modal-input"
                    name="pollution_valid"
                    type="text"
                    // required
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
                    // required
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
                    required
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
                    type="number"
                    // required
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
                    type="number"
                    // required
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
                    // required
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
                    type="date"
                    // required
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
                    // required
                    value={newVehicleData.vehicle_spec}
                    onChange={handleChange}
                  />
                </label>
                <br />
                <label className="alignsame">
                  Max Layover (in hours):&nbsp;
                  <input
                    className="modal-input"
                    name="max_layover"
                    type="number"
                    // required
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
                    // required
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
                    // required
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
                    // required
                    value={newVehicleData.booking_done}
                    onChange={handleChange}
                  />
                </label>
                <label className="alignsame">
                  Source Address&nbsp;
                  <input
                    className="modal-input"
                    name="source_address"
                    type="text"
                    // required
                    value={newVehicleData.source_address}
                    onChange={handleChange}
                  />
                </label>
                <label className="alignsame">
                  Destination Address&nbsp;
                  <input
                    className="modal-input"
                    name="destination_address"
                    type="text"
                    // required
                    value={newVehicleData.destination_address}
                    onChange={handleChange}
                  />
                </label>
                <label className="alignsame">
                  Source Address Pincode&nbsp;
                  <input
                    className="modal-input"
                    name="source_address_pincode"
                    type="number"
                    // required
                    value={newVehicleData.source_address_pincode}
                    onChange={handleChange}
                  />
                </label>
                <label className="alignsame">
                  Destination Address Pincode&nbsp;
                  <input
                    className="modal-input"
                    name="destination_address_pincode"
                    type="number"
                    // required
                    value={newVehicleData.destination_address_pincode}
                    onChange={handleChange}
                  />
                </label>
                <label className="alignsame">
                  Date Of Shippment&nbsp;
                  <input
                    className="modal-input"
                    name="dateOfShippment"
                    type="date"
                    // required
                    value={newVehicleData.dateOfShippment}
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
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>Source Address:</span>{" "}
                    {truckD.source_address}
                  </div>
                  <div className={classes.truckBoxText}>
                    <span style={{ fontWeight: "bold" }}>
                      Destination Address:
                    </span>{" "}
                    {truckD.destination_address}
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
