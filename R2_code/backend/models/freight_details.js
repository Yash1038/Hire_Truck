const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Freight_Details_Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  load_type: {
    type: String,
    required: true,
  },
  source_address: {
    type: String,
    required: true,
  },
  destination_address: {
    type: String,
    required: true,
  },
  source_address_pincode: {
    type: String,
    required: true,
  },
  destination_address_pincode: {
    type: String,
    required: true,
  },
  requested_quotes: {
    type: String,
    required: true,
  },
  recieved_quotes: {
    type: String,
    required: true,
  },
  vehicle_req: {
    type: String,
    required: true,
  },
  dateOfShippment: {
    type: String,
    required: true,
  },
  isTrue:{
    type: Boolean,
    default: false,
    required: true,
  }
});

module.exports = Freight_Details = mongoose.model(
  "Freight_Details",
  Freight_Details_Schema
);
