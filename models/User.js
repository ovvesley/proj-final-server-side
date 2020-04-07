/**
 * Module for User Schema. This module requires the modules {@link module:AccountPlan} 
 * and {@link module:System }
 * @module
 * @requires module:AccountPlan
 * @requires module:System
 * @author Gabriel Amaral
 */

const mongoose = require("mongoose");
const AccountPlanSchema = require('./AccountPlan'); 
const SystemSchema = require('./System');
const bcrypt = require('bcrypt');


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
    default: 0,
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

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model("User", UserSchema);

module.exports = User;
