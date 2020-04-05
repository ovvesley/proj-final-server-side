const mongoose = require("mongoose");

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
      type: Schema.Types.ObjectId,
      ref: "Microcontroller",
    },
  ],
});

var System = mongoose.model("System", systemSchema);

module.exports = System;
