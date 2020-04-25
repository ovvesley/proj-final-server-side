/**
 * Module for Microcontroller Schema. This module requires the module {@link module:Sensor}
 * @module
 * @requires module:models/sensor.js
 * @author Gabriel Amaral
 */
const mongoose = require("mongoose");

const SensorSchema = require('./Sensor');

/**
 * MicrocontrollerSchema schema
 * @class Microcontroller
 */
const MicrocontrollerSchema = new mongoose.Schema({
  nameMicrocontroller: {
    type: String,
    unique: true,
    required:true
  },
  type: {
    type: String,
    required: true
  },
  sensors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: SensorSchema,
      required:false,
    },
  ],
});

var Microcontroller = mongoose.model("Microcontroller", MicrocontrollerSchema);

module.exports = Microcontroller;
