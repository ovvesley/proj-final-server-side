/**
 * Module for System Schema. This module requires the module {@link module:Microcontroller}
 * @module 
 * @requires module:Microcontroller
 * @author Gabriel Amaral
 */
const mongoose = require("mongoose");
const MicrocontrollerSchema = require('./Microcontroller'); 

/**
 * SystemSchema schema
 * @class System
 */
const SystemSchema = new mongoose.Schema({
  nameSystem: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  category: {
    type: String,
    default: "",
  },
  microcontrollers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: MicrocontrollerSchema,
    },
  ],
});

var System = mongoose.model("System", SystemSchema);

module.exports = System;
