const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Accepted_Schema = new Schema({
  freight_id: {
    type: String,
    required: true,
  },
  truck_id: {
    type: String,
    required: true,
  },
});

module.exports = Accepted = mongoose.model(
  "Accepted",
  Accepted_Schema
);
