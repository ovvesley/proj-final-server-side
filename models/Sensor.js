const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
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

var Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;
