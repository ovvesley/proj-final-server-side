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

mongoose.model("Microcontroller", microcontrollerSchema);

module.exports = Microcontroller;
