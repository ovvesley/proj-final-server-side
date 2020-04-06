var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserSchema = require("../models/User");

router.post("/", async (req, res) => {
  try {
    const newUser = await UserSchema.create(req.body);
    return res.send(newUser);
  } catch (err) {
    return res.status(400).send({ error: "Error creating new user" });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const {
      login,
      password,
      experienceDays,
      accountPlanType,
      systems,
    } = req.body;
    const id = mongoose.Types.ObjectId(req.params.userId);
    const newUser = await UserSchema.findByIdAndUpdate(
      id,
      {
        login,
        password,
        experienceDays,
        accountPlanType,
        systems,
      },
      { new: true }
    );
    return res.send({ status: "ok" });
  } catch (err) {
    return res.status(400).send({ error: "Error updating user" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.userId);
    console.log(id);
    await UserSchema.findByIdAndRemove(id);
    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "Error deleting user" });
  }
});

module.exports = router;
