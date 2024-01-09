const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Truck_Owner_Schema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: [true, "*User already exists"],
  },
  companyType: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: [true, "*User already exists"],
  },
  tin: {
    type: String,
    required: true,
    unique: [true, "*User already exists"],
  },
  gstNumber: {
    type: String,
    required: true,
  },
  officeAddress: {
    type: String,
    required: true,
  },
  officePincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: [true, "*User already exists"],
  },
  contact: {
    type: String,
    required: true,
    unique: [true, "*User already exists"],
  },
  faxNumber: {
    type: String,
    required: true,
    unique: [true, "*User already exists"],
  },
  username: {
    type: String,
    required: true,
    unique: [true, "*User already exists"],
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = Truck_Owner = mongoose.model(
  "Truck_Owner",
  Truck_Owner_Schema
);
