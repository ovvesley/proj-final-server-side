const mongoose = require("mongoose");
const MicrocontrollerSchema = require('./Microcontroller'); 

const systemSchema = new mongoose.Schema({
  nameSystem: {
    type: String,
    trim: true,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  microcontroller: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: MicrocontrollerSchema,
    },
  ],
});

var System = mongoose.model("System", systemSchema);

module.exports = System;
