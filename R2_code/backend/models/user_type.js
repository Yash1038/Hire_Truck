const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User_Type_Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  userType: {
    type: String,
    required: true,
  },
});

module.exports = User_Type = mongoose.model("User_Type", User_Type_Schema);
