/**
 * Module for Account Plan Schema
 * @module 
 * @author Gabriel Amaral 
 */
const mongoose = require("mongoose");

/**
 * AccountPlanSchema schema
 * @class AccountPlan
 */

const AccountPlanSchema = new mongoose.Schema({
  namePlan: {
    type: String,
    trim: true,
    unique: true,
    required: true, 
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

var AccountPlan = mongoose.model("AccountPlan", AccountPlanSchema);


module.exports = AccountPlan;
