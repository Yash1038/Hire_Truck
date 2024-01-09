const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'swayamagrawal1004@gmail.com',
    pass: 'qnolzrpnglfkoimr',
  },
});


const PORT = 4003;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DB =
  "mongodb+srv://schlechter_hire_truck:dduEU6ZjCwDnja9V@clusterhiretruck.d0nc694.mongodb.net/Hire_Truck_db?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB Connection Successful!");
  });

const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

const UserRouter = require("./routes/users");
app.use("/user", UserRouter);

app.post('/user/send-email', async (req, res) => {
  console.log("enetered email route!!");
  // const {blockedUserEmail} = req.body;
  console.log(req.body);
  
  const blockedUserEmail = req.body.blockedUserEmail;
  const companyName = req.body.companyName;
  const contact = req.body.contact;
  const source_address_pincode = req.body.source_address_pincode;
  const destination_address_pincode = req.body.destination_address_pincode;

  // const blockedUserEmail = "swayam.agrawal@students.iiit.ac.in"

  // Setup email data with unicode symbols
  const mailOptions = {
    from: '"Swayam" <swayamagrawal1004@gmail.com>', // sender address
    to: `${blockedUserEmail}`, // list of receivers
    subject: 'Quotation Offer', // Subject line
    text: `You have been offered a quotation by ${companyName} with contact: ${contact} for a freight with
    source address pincode: ${source_address_pincode} and delivery address pincode: ${destination_address_pincode}
    on our platform. Kindly visit the website for more details.`, // plain text body
  };

  console.log(blockedUserEmail)

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/user/send-email-freight', async (req, res) => {
  console.log("enetered email route!!");
  // const {blockedUserEmail} = req.body;

  const blockedUserEmail = req.body.blockedUserEmail;
  const companyName = req.body.companyName;
  const contact = req.body.contact;
  const load_types_handled = req.body.load_types_handled;
  const regular_transport_route = req.body.regular_transport_route;
  const max_layover = req.body.max_layover;
  const max_volume = req.body.max_volume;
  const vehicle_type = req.body.vehicle_type;

  // Setup email data with unicode symbols
  const mailOptions = {
    from: '"Swayam" <swayamagrawal1004@gmail.com>', // sender address
    to: `${blockedUserEmail}`, // list of receivers
    subject: 'Quotation Request', // Subject line
    text: `${companyName} with contact ${contact} has requested a quotation of vehicle type: ${vehicle_type} with max_volume: ${max_volume}
    and max_layover of ${max_layover} with ${regular_transport_route} as regular transport route, handling 
    ${load_types_handled} on our platform.
    Kindly visit the website for more details.`, // plain text body
  };

  console.log(blockedUserEmail)

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

server.listen(PORT, () => {
  console.log(`Backend app listening at http://localhost:${PORT}`);
});
