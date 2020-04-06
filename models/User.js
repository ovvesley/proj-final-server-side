const mongoose = require("mongoose");
const AccountPlanSchema = require('./AccountPlan'); 
const SystemSchema = require('./System');
const bcrypt = require('bcrypt');


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

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model("User", userSchema);

module.exports = User;
