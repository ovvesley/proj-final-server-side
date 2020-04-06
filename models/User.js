const mongoose = require("mongoose");
const AccountPlanSchema = require('./AccountPlan'); 
const SystemSchema = require('./System');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    trim: true,
    default: "",
  },
  password: {
    type: String,
    trim: true,
    default: "",
  },
  experienceDays: {
    type: Number,
  },
  accountPlanType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: AccountPlanSchema,
  },
  systems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: SystemSchema,
    },
  ],
});

var User = mongoose.model("User", userSchema);

module.exports = User;
