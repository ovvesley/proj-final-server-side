const mongoose = require("mongoose");
const SensorSchema = require('./Sensor');

const microcontrollerSchema = new mongoose.Schema({
  nameMicrocontroller: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  sensors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: SensorSchema,
    },
  ],
});

var Microcontroller = mongoose.model("Microcontroller", microcontrollerSchema);

module.exports = Microcontroller;
