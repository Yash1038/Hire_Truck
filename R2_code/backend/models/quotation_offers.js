const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Quotation_Offer_Schema = new Schema({
  freight_id: {
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
  loadType: {
    type: String,
    required: true,
  },
  dateOfShippment: {
    type: String,
    required: true,
  },
  destination_address: {
    type: String,
    required: true,
  },
  source_address: {
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
});

module.exports = Quotation_Offer = mongoose.model(
  "Quotation_Offer",
  Quotation_Offer_Schema
);
