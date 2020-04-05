const mongoose = require("mongoose");

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
      type: Schema.Types.ObjectId,
      ref: "Sensor",
    },
  ],
});

var Microcontroller = mongoose.model("Microcontroller", microcontrollerSchema);

module.exports = Microcontroller;
