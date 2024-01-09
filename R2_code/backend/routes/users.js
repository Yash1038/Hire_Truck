const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const Truck_Owner = require("../models/truck_owner");
const Freight_Owner = require("../models/freight_owner");
const Freight_Details = require("../models/freight_details");
const Truck_Details = require("../models/truck_details");
const User_Type = require("../models/user_type");
const Quotation_Offer = require("../models/quotation_offers");
const Quotation_Req = require("../models/quotation_reqs");
const Accepted = require("../models/accepted");

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
      source_address: body.source_address,
      destination_address: body.destination_address,
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
      max_layover: body.max_layover,
      return_truck_load_offers: body.return_truck_load_offers,
      quotation_sent: body.quotation_sent,
      booking_done: body.booking_done,
      total_revenue: body.total_revenue,
      source_address_pincode: body.source_address_pincode,
      destination_address_pincode: body.destination_address_pincode,
      source_address: body.source_address,
      destination_address: body.destination_address,
      dateOfShippment: body.dateOfShippment,
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

  console.log(freight_det);

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

router.post("/get_trucks", async (req, res) => {
  try {
    const subarray = await Truck_Details.find({});
    // console.log("HI")
    // console.log(subarray)
    res.send({ subarray: subarray });
  } catch (error) {
    console.log("error", error);
    res.send({ status: "error" });
  }
});
router.post("/get_freights", async (req, res) => {
  try {
    const subarray = await Freight_Details.find({});
    // console.log("HI")
    // console.log(subarray)
    res.send({ subarray: subarray });
  } catch (error) {
    console.log("error", error);
    res.send({ status: "error" });
  }
});

router.post("/extract_freight_owner_email", (req, res) => {
  extractFreightOwner_email(req, res);
});

async function extractFreightOwner_email(req, res) {
  console.log("Entering");
  const body = req.body;
  const username = body.userName;

  const user = await Freight_Owner.findOne({ username: username });
  if (user) {
    res.send(user);
  } else res.send("err");
}

router.post("/extract_truck_owner_email", (req, res) => {
  extractTruckOwner_email(req, res);
});

async function extractTruckOwner_email(req, res) {
  const body = req.body;
  const username = body.userName;

  console.log(username);

  const user = await Truck_Owner.findOne({ username: username });
  if (user) {
    res.send(user);
  } else res.send("err");
}

router.post("/store_quote", (req, res) => {
  storeQuote(req, res);
});

async function storeQuote(req, res) {
  try {
    const body = req.body;
    const freight_id = body.freight_id;
    const truck_owner_username = body.truck_owner_username;
    const freight_owner_username = body.freight_owner_username;
    const status = body.status;
    const loadType = body.loadType;
    const dateOfShippment = body.dateOfShippment;
    const source_address = body.source_address;
    const destination_address = body.destination_address;
    const source_address_pincode = body.source_address_pincode;
    const destination_address_pincode = body.destination_address_pincode;

    const newQuotation_Offers = new Quotation_Offer({
      freight_id: freight_id,
      truck_owner_username: truck_owner_username,
      freight_owner_username: freight_owner_username,
      status: status,
      loadType: loadType,
      dateOfShippment: dateOfShippment,
      source_address: source_address,
      destination_address: destination_address,
      source_address_pincode: source_address_pincode,
      destination_address_pincode: destination_address_pincode,
    });

    // save this user to the database
    newQuotation_Offers
      .save()
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    console.log("error in storeQuote", error);
    res.send(400, { error: error });
  }
}

router.post("/store_quote_request", (req, res) => {
  storeQuoteRequest(req, res);
});

async function storeQuoteRequest(req, res) {
  // console.log("hereeee","sdijjovdzjfoja");
  try {
    const body = req.body;
    const truck_id = body.truck_id;
    const freight_owner_username = body.freight_owner_username;
    const truck_owner_username = body.truck_owner_username;
    const status = body.status;
    const load_types_handled = body.load_types_handled;
    const vehicle_type = body.vehicle_type;
    const max_volume = body.max_volume;
    const max_layover = body.max_layover;
    const regular_transport_route = body.regular_transport_route;
    const source_address = body.source_address;
    const destination_address = body.destination_address;
    const source_address_pincode = body.source_address_pincode;
    const destination_address_pincode = body.destination_address_pincode;
    const vehicle_reg_no = body.vehicle_reg_no;
    const dateOfShippment = body.dateOfShippment;

    const newQuotation_Req = new Quotation_Req({
      truck_id: truck_id,
      freight_owner_username: freight_owner_username,
      truck_owner_username: truck_owner_username,
      status: status,
      load_types_handled: load_types_handled,
      vehicle_type: vehicle_type,
      max_volume: max_volume,
      max_layover: max_layover,
      regular_transport_route: regular_transport_route,
      source_address: source_address,
      destination_address: destination_address,
      source_address_pincode: source_address_pincode,
      destination_address_pincode: destination_address_pincode,
      vehicle_reg_no: vehicle_reg_no,
      dateOfShippment: dateOfShippment,
    });

    console.log({
      truck_id: truck_id,
      freight_owner_username: freight_owner_username,
      truck_owner_username: truck_owner_username,
      status: status,
      load_types_handled: load_types_handled,
      vehicle_type: vehicle_type,
      max_volume: max_volume,
      max_layover: max_layover,
      regular_transport_route: regular_transport_route,
    });
    // save this user to the database
    newQuotation_Req
      .save()
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    console.log("error in storeQuoteReq", error);
    res.send(400, { error: error });
  }
}

router.post("/update_quote", (req, res) => {
  updateQuote(req, res);
});

async function getQuotes(req, res) {
  const query = { freight_owner_username: req.body.freight_owner_username };
  const quotation_det = await Quotation_Offer.find(query);

  if (!quotation_det) {
    res.send(400, { error: err });
  } else {
    console.log("Success In Finding freight details");
    console.log(quotation_det);
    res.send(quotation_det);
  }
}

router.post("/get_quotes", (req, res) => {
  getQuotes(req, res);
});

router.post("/get_quote_requests", (req, res) => {
  getQuoteRequests(req, res);
});

async function getQuoteRequests(req, res) {
  const query = { truck_owner_username: req.body.truck_owner_username };
  const quotation_det = await Quotation_Req.find(query);

  if (!quotation_det) {
    return res.send(400, { error: err });
  } else {
    console.log("Success In Finding freight details");
    console.log(quotation_det);
    return res.send(quotation_det);
  }
}

async function updateQuote(req, res) {
  const body = req.body;
  const quote_id = body.quote_id;
  const status = body.status;

  console.log("In update quote " + quote_id);

  var myquery = { _id: quote_id };
  var newvalues = { $set: { status: status } };
  Quotation_Offer.findOneAndUpdate(myquery, newvalues, { upsert: true }).then(
    (doc, err) => {
      if (err) {
        return res.send(400);
      }
      console.log("Success In Updation of status of quotes");
      if (status == "1") subseq_quote(req, res);
      else{
        reject(req,res);
      }
    }
  );
}

async function reject(req,res)  {
  const body = req.body;
  const quote_id = body.quote_id;
  console.log("In delete quote reject " + quote_id);
  Quotation_Offer.deleteOne({ _id: quote_id }).then(
    (doc3, err3) => {
      if (err3) {
        console.log("errorwhat :", err3);
        res.status(400).send(err3);
      }
      console.log("Success In Deleting quotation offer in reject case: ", doc3);
      res.status(200).send(doc3);
    }
  );
}

async function subseq_quote(req, res) {
  const body = req.body;
  const quote_id = body.quote_id;
  const freight_id = body.freight_id;
  const truck_id = body.truck_id;
  console.log("In delete quote " + quote_id);
  var myquery = { _id: freight_id };
  var myquery2 = { _id: truck_id };
  var newvalues = { $set: { isTrue: true } };
  var ok = false;
  try {
    const body = req.body;
    const newAccept = new Accepted({
      freight_id: body.freight_id,
      truck_id: body.truck_id,
    });

    await newAccept
      .save()
      .then((user) => {
        ok = true;
        console.log("lavde ka:", ok);
      })
      .catch((err) => {
        console.log("ISSUUUUUUUUUUUUUUUUEEEEEEEEEEEEEE");
        console.log(err);
        res.status(400).send(err);
      });

    console.log("IDIJVSOIVJDOSK", ok);
    if (ok) {
      console.log("INSIDE!! ");
      Freight_Details.findOneAndUpdate(myquery, newvalues, {
        upsert: true,
      }).then((doc1, err1) => {
        if (err1) {
          return res.status(400).send(err1);
        }
        console.log("Success In Updation of isTrue in freight_details model");
        Truck_Details.findOneAndUpdate(myquery2, newvalues, {
          upsert: true,
        }).then((doc2, err2) => {
          if (err2) {
            return res.status(400).send(err2);
          }
          console.log("Success In Updation of isTrue in truck_details model");
          Quotation_Offer.deleteMany({ freight_id: freight_id }).then(
            (doc3, err3) => {
              if (err3) {
                console.log("errorwhat :", err3);
                res.status(400).send(err3);
              }
              console.log("Success In Deleting  quotation offer: ", doc3);
              res.status(200).send(doc3);
            }
          );
        });
      });
    } else {
      res.status(400).send("Lavde Ka error");
    }
  } catch {
    console.log("ISSUUUUUUUUUUUUUUUUEEEEEEEEEEEEEE");
    console.log(err);
    res.status(400).send(err);
  }
}

router.post("/update_quote_req", (req, res) => {
  updateQuoteReq(req, res);
});

async function updateQuoteReq(req, res) {
  const body = req.body;
  const quote_id = body.quote_id;
  const status = body.status;

  console.log("In update quote req " + quote_id);

  var myquery = { _id: quote_id };
  var newvalues = { $set: { status: status } };
  Quotation_Req.findOneAndUpdate(myquery, newvalues, { upsert: true }).then(
    (doc, err) => {
      if (err) {
        return res.send(400);
      }
      console.log("Success In Updation of status of quotes req");
      if (status == "1") subseq_quote_req(req, res);
      else reject_req(req,res);
    }
  );
}

async function reject_req(req,res)
{
  const body = req.body;
  const quote_id = body.quote_id;
  const freight_id = body.freight_id;
  const truck_id = body.truck_id;
  console.log("In delete quote reject req " + quote_id);
  Quotation_Req.deleteOne({ _id: quote_id }).then(
    (doc3, err3) => {
      if (err3) {
        console.log("errorwhat :", err3);
        res.status(400).send(err3);
      }
      console.log("Success In Deleting quotation offer in reject req case: ", doc3);
      res.status(200).send(doc3);
    }
  );
}

async function subseq_quote_req(req, res) {
  const body = req.body;
  const quote_id = body.quote_id;
  const freight_id = body.freight_id;
  const truck_id = body.truck_id;
  console.log("In delete quote req " + quote_id);
  var myquery = { _id: freight_id };
  var myquery2 = { _id: truck_id };
  var newvalues = { $set: { isTrue: true } };
  var ok = false;
  try {
    const body = req.body;
    const newAccept = new Accepted({
      freight_id: body.freight_id,
      truck_id: body.truck_id,
    });

    await newAccept
      .save()
      .then((user) => {
        ok = true;
        console.log("lavde ka:", ok);
      })
      .catch((err) => {
        console.log("ISSUUUUUUUUUUUUUUUUEEEEEEEEEEEEEE");
        console.log(err);
        res.status(400).send(err);
      });

    console.log("IDIJVSOIVJDOSK", ok);
    if (ok) {
      console.log("INSIDE!! ");
      Freight_Details.findOneAndUpdate(myquery, newvalues, {
        upsert: true,
      }).then((doc1, err1) => {
        if (err1) {
          return res.status(400).send(err1);
        }
        console.log("Success In Updation of isTrue in freight_details model");
        Truck_Details.findOneAndUpdate(myquery2, newvalues, {
          upsert: true,
        }).then((doc2, err2) => {
          if (err2) {
            return res.status(400).send(err2);
          }
          console.log("Success In Updation of isTrue in truck_details model");
          Quotation_Req.deleteMany({ truck_id: truck_id }).then(
            (doc3, err3) => {
              if (err3) {
                console.log("errorwhat :", err3);
                res.status(400).send(err3);
              }
              console.log("Success In Deleting  quotation offer: ", doc3);
              res.status(200).send(doc3);
            }
          );
        });
      });
    } else {
      res.status(400).send("Lavde Ka error");
    }
  } catch {
    console.log("ISSUUUUUUUUUUUUUUUUEEEEEEEEEEEEEE");
    console.log(err);
    res.status(400).send(err);
  }
}
router.post("/accepted_details", async (req, res) => {
  try {
    // console.log("YOOOO")
    const subarray = await Accepted.find({});
    // console.log(subarrray)
    res.send(subarray)
  }
  catch {
    console.log("ISSUUUUUUUUUUUUUUUUEEEEEEEEEEEEEE");
    console.log(err);
    res.status(400).send(err);
  }
})
router.post("/temp",async(req,res)=>{
  const freights= await Freight_Details.find({username:req.body.userName});
  const freightIds = freights.map(e => e._id);
  const acceptedFreights=await Accepted.find({freight_id:{ $in: freightIds }});
  // console.log(acceptedFreights);
  const subarray_f = await Freight_Details.find({ _id: { $in: acceptedFreights.map(e => e.freight_id) } });
  const subarray_t = await Truck_Details.find({ _id: { $in: acceptedFreights.map(e => e.truck_id) } });
  // console.log({ subarray_f, subarray_t });
  res.send({ subarray_f, subarray_t });
  // const subarray_f = await Freight_Details.find({_id:{$in : acceptedFreights.freight_id}});
  // const subarray_t = await Truck_Details.find({_id:{$in:acceptedFreights.truck_id}});
  // console.log({ subarray_f, subarray_t });
  // res.send({ subarray_f, subarray_t });
})
router.post("/temp2",async(req,res)=>{
  // console.log("hi")
  // console.log(req.body)
  const trucks= await Truck_Details.find({username:req.body.userName});
  const truckIds = trucks.map(e => e._id);
  // console.log(truckIds)
  const acceptedTrucks=await Accepted.find({truck_id:{ $in: truckIds }});
  // console.log(acceptedTrucks);
  const subarray_f = await Freight_Details.find({ _id: { $in: acceptedTrucks.map(e => e.freight_id) } });
  const subarray_t = await Truck_Details.find({ _id: { $in: acceptedTrucks.map(e => e.truck_id) } });
  // console.log({ subarray_f, subarray_t });
  res.send({ subarray_f, subarray_t });
  // const subarray_f = await Freight_Details.find({_id:{$in : acceptedFreights.freight_id}});
  // const subarray_t = await Truck_Details.find({_id:{$in:acceptedFreights.truck_id}});
  // console.log({ subarray_f, subarray_t });
  // res.send({ subarray_f, subarray_t });
})

// async function accept_call(req, res) {
//   try {
//     const body = req.body;
//     const newAccept = new Accepted({
//       freight_id: body.freight_id,
//       truck_id: body.truck_id,
//     });

//     newAccept
//       .save()
//       .then((user) => {
//         res.status(200).json({
//           user,
//         });
//       })
//       .catch((err) => {
//         console.log("ISSUUUUUUUUUUUUUUUUEEEEEEEEEEEEEE");
//         console.log(err);
//         res.status(400).send(err);
//       });
//   } catch {
//     console.log("ISSUUUUUUUUUUUUUUUUEEEEEEEEEEEEEE");
//     console.log(err);
//     res.status(400).send(err);
//   }
// }

module.exports = router;
