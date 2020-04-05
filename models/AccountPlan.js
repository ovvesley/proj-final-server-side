const mongoose = require("mongoose");

const accountPlanSchema = new mongoose.Schema({
  namePlan: {
    type: String,
    trim: true,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
});

var AccountPlan = mongoose.model("AccountPlan", accountPlanSchema);


module.exports = AccountPlan;
