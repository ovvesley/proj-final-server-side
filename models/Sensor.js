/**
 * Module for Sensor Schema
 * @module 
 * @author Gabriel Amaral
 */
const mongoose = require("mongoose");

/**
 * SensorSchema schema
 * @class Sensor
 */
const SensorSchema = new mongoose.Schema({
  nameSensor: {
    type: String,
    trim: true,
    default: "",
  },
  digitalValue: {
    type: Number,
  },
  analogValue: {
    type: Number,
  },
  portNumber: {
    type: Number,
  },
});

var Sensor = mongoose.model("Sensor", SensorSchema);

module.exports = Sensor;
