const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Truck_Details_Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  vehicle_reg_no: {
    type: String,
    required: true,
  },
  vehicle_type: {
    type: String,
    required: true,
  },
  vehicle_reg_date: {
    type: String,
    required: true,
  },
  vehicle_age: {
    type: String,
    required: true,
  },
  vehicle_chassis_no: {
    type: String,
    required: true,
  },
  pollution_valid: {
    type: String,
    required: true,
  },
  insurance_validity_date: {
    type: String,
    required: true,
  },
  load_types_handled: {
    type: String,
    required: true,
  },
  regular_transport_route: {
    type: String,
    required: true,
  },
  max_volume: {
    type: String,
    required: true,
  },
  axle: {
    type: String,
    required: true,
  },
  transmission_type: {
    type: String,
    required: true,
  },
  vehicle_spec: {
    // EV or else
    type: String,
    required: true,
  },
  max_layover: {
    type: String,
    required: true,
  },
  return_truck_load_offers: {
    // EV or else
    type: String,
    required: true,
  },
  quotation_sent: {
    type: String,
    required: true,
  },
  booking_done: {
    type: String,
    required: true,
  },
  isTrue:{
    type: Boolean,
    default: false,
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
  dateOfShippment: {
    type: String,
    required: true,
  },
});

module.exports = Truck_Details = mongoose.model(
  "Truck_Details",
  Truck_Details_Schema
);
