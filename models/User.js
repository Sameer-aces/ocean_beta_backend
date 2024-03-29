const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    required: true,
    default: "Premium",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  //   date: {
  //     type: Date,
  //     required: Date.now(),
  //   },
});
module.exports = User = mongoose.model("users", UserSchema);
