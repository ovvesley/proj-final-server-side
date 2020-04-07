/**
 * Module for User Schema. This module requires the modules {@link module:AccountPlan} 
 * and {@link module:System }
 * @module User
 * @requires module:AccountPlan
 * @requires module:System
 * @author Gabriel Amaral
 */

const mongoose = require("mongoose");
const AccountPlanSchema = require('./AccountPlan'); 
const SystemSchema = require('./System');

/**
 * UserSchema schema
 * @class User
 */
const UserSchema = new mongoose.Schema({
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

var User = mongoose.model("User", UserSchema);

module.exports = User;
