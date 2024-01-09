const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Quotation_Request_Schema = new Schema({
  truck_id: {
    type: String,
    required: true,
  },
  freight_owner_username: {
    type: String,
    required: true,
  },
  truck_owner_username: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  load_types_handled: {
    type: String,
    required: true,
  },
  vehicle_type: {
    type: String,
    required: true,
  },
  max_volume: {
    type: String,
    required: true,
  },
  max_layover: {
    type: String,
    required: true,
  },
  regular_transport_route: {
    type: String,
    required: true,
  },
  source_address:{
    type: String,
    required: true,
  },
  destination_address:{
    type: String,
    required: true,
  },
  source_address_pincode:{
    type: String,
    required: true,
  },
  destination_address_pincode:{
    type: String,
    required: true,
  },
  vehicle_reg_no:{
    type: String,
    required: true,
  },
  dateOfShippment: {
    type: String,
    required: true,
  },
});

module.exports = Quotation_Request = mongoose.model(
  "Quotation_Request",
  Quotation_Request_Schema
);
