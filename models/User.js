const mongoose = require("mongoose");

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
  acconutPlanType: {
    type: Schema.Types.ObjectId,
    ref: "AccountPlan",
  },
  systems: [
    {
      type: Schema.Types.ObjectId,
      ref: "System",
    },
  ],
});

mongoose.model("User", userSchema);

module.exports = User;
