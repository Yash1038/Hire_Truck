const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const Truck_Owner = require("../models/truck_owner");
const Freight_Owner = require("../models/freight_owner");
const Freight_Details = require("../models/freight_details");
const Truck_Details = require("../models/truck_details");
const User_Type = require("../models/user_type");

const signToken = (user) => {
  return jwt.sign({ user }, process.env.JWTSECRET);
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.username);

  return res.status(statusCode).json({
    token,
  });
};

router.get("/", function (req, res) {
  getRoot(res);
});

function getRoot(res) {
  Truck_Owner.find(function (err, users) {
    if (err) {
    } else {
      res.json(users);
    }
  });
}

router.post("/register_truck_owner", (req, res) => {
  registerTruckOwner(req, res);
});

async function registerTruckOwner(req, res) {
  try {
    const body = req.body;
    const username = body.username;
    console.log(req.body);
    const userExists = await Truck_Owner.findOne({ username: username });
    if (userExists) {
      res.status(404).send("User exists already in Truck Owner DB");
    } else {
      const userType = new User_Type({
        username: body.username,
        userType: "Truck",
      });

      userType.save().catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });

      const newUser = new Truck_Owner({
        companyName: body.companyName,
        companyType: body.companyType,
        registrationDate: body.registrationDate,
        registrationNumber: body.registrationNumber,
        tin: body.tin,
        gstNumber: body.gstNumber,
        officeAddress: body.officeAddress,
        officePincode: body.officePincode,
        state: body.state,
        emailId: body.emailId,
        contact: body.contact,
        faxNumber: body.faxNumber,
        username: body.username,
        password: body.password,
      });

      console.log(newUser);

      newUser
        .save()
        .then((user) => {
          res.status(200).json({
            registrationNumber: user.registrationNumber,
          });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  } catch {
    res.status(400).send(err);
  }
}

router.post("/extract_user_details", (req, res) => {
  extractUserDetails(req, res);
});

async function extractUserDetails(req, res) {
  const body = req.body;
  const token = body.jwt;

  console.log(body);

  const decoded = jwt.verify(token, process.env.JWTSECRET);

  const username = decoded.user;

  console.log(username);

  const userDetails = await User_Type.findOne({ username: username });

  console.log(userDetails);

  // console.log(us)

  if (!userDetails) {
    res.status(404).send("User does not exist");
  } else {
    res.status(200).json({
      userDetails,
    });
  }
}

router.post("/register_freight_owner", (req, res) => {
  registerFreightOwner(req, res);
});

async function registerFreightOwner(req, res) {
  try {
    const body = req.body;
    const username = body.username;
    const userExists = await Freight_Owner.findOne({ username: username });

    if (userExists) {
      res.status(402).send("User exists already in Freight Owner DB");
    } else {
      const userType = new User_Type({
        username: body.username,
        userType: "Freight",
      });

      userType.save().catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });

      const newUser = new Freight_Owner({
        companyName: body.companyName,
        companyType: body.companyType,
        registrationDate: body.registrationDate,
        registrationNumber: body.registrationNumber,
        tin: body.tin,
        gstNumber: body.gstNumber,
        officeAddress: body.officeAddress,
        officePincode: body.officePincode,
        state: body.state,
        emailId: body.emailId,
        contact: body.contact,
        faxNumber: body.faxNumber,
        username: body.username,
        password: body.password,
      });

      newUser
        .save()
        .then((user) => {
          console.log(user);
          res.status(200).json({
            registrationNumber: user.registrationNumber,
          });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  } catch {
    res.status(400).send(err);
  }
}

router.post("/login_truck_owner", (req, res) => {
  loginTruckOwner(req, res);
});

async function loginTruckOwner(req, res) {
  const body = req.body;
  const username = body.userName;
  const password = body.passWord;

  const user = await Truck_Owner.findOne({ username: username });

  if (user && user.password === password) {
    createSendToken(user, 200, res);
  } else {
    res.status(401).send("err");
  }
}

router.post("/login_freight_owner", (req, res) => {
  loginFreightOwner(req, res);
});

async function loginFreightOwner(req, res) {
  console.log("In login");

  const body = req.body;
  const username = body.userName;
  const password = body.passWord;

  const user = await Freight_Owner.findOne({ username: username });

  if (user && user.password == password) {
    createSendToken(user, 200, res);
  } else {
    res.status(401).send("err");
  }
}

router.use(auth);

router.post("/add_freight_details", (req, res) => {
  addFreightDetails(req, res);
});

async function addFreightDetails(req, res) {
  try {
    const body = req.body;

    const newFreight_Details = new Freight_Details({
      username: body.username,
      load_type: body.load_type,
      source_address_pincode: body.source_address_pincode,
      destination_address_pincode: body.destination_address_pincode,
      requested_quotes: body.requested_quotes,
      recieved_quotes: body.recieved_quotes,
      vehicle_req: body.vehicle_req,
      dateOfShippment: body.dateOfShippment,
    });

    newFreight_Details
      .save()
      .then((user) => {
        res.status(200).json({
          user,
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch {
    res.status(400).send(err);
  }
}

router.post("/add_truck_details", (req, res) => {
  addTruckDetails(req, res);
});

async function addTruckDetails(req, res) {
  try {
    const body = req.body;

    const newTruck_Details = new Truck_Details({
      username: req.username,
      vehicles_owned: body.vehicles_owned,
      vehicle_reg_no: body.vehicle_reg_no,
      vehicle_type: body.vehicle_type,
      vehicle_reg_date: body.vehicle_reg_date,
      vehicle_age: body.vehicle_age,
      vehicle_chassis_no: body.vehicle_chassis_no,
      pollution_valid: body.pollution_valid,
      insurance_validity_date: body.insurance_validity_date,
      load_types_handled: body.load_types_handled,
      regular_transport_route: body.regular_transport_route,
      max_volume: body.max_volume,
      axle: body.axle,
      transmission_type: body.transmission_type,
      vehicle_spec: body.vehicle_spec,
      if_layover: body.if_layover,
      max_layover: body.max_layover,
      return_truck_load_offers: body.return_truck_load_offers,
      quotation_sent: body.quotation_sent,
      booking_done: body.booking_done,
      total_revenue: body.total_revenue,
    });

    console.log(newTruck_Details);

    newTruck_Details
      .save()
      .then((user) => {
        res.status(200).json({
          user,
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch {
    res.status(400).send(err);
  }
}
router.post("/extract_freight_details", (req, res) => {
  extractFreightDetails(req, res);
});

async function extractFreightDetails(req, res) {
  const body = req.body;
  const username = req.username;
  const query = { username: username };

  const freight_det = await Freight_Details.find(query);

  if (!freight_det) {
    res.send(400, { error: err });
  } else {
    console.log("Success In Finding freight details");
    console.log(freight_det);
    res.send(freight_det);
  }
}

router.post("/extract_truck_details", (req, res) => {
  extractTruckDetails(req, res);
});

async function extractTruckDetails(req, res) {
  const body = req.body;
  // console.log("body", body);
  const username = req.username;
  const query = { username: username };
  // console.l
  console.log(query);
  const truck_det = await Truck_Details.find(query);

  if (!truck_det) {
    res.send(400, { error: err });
  } else {
    console.log("Success In Finding vehicle details");
    res.send(truck_det);
  }
}

module.exports = router;
