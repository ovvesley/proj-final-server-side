var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserSchema = require("../models/User");

/**
 * @swagger
 * /user: 
 *  post:
 *    tags:
 *    - user
 *    summary: Create a user
 *    description: Register a new user on the database via sing up page
 *    operationId: createUser
 *    parameters: 
 *    - in: body
 *      name: body
 *      description: create user object
 *      required: true
 *      schema: 
 *        $ref: '#/definitions/User'
 *      responses: 
 *        '200': 
 *          description: Success on creating the new user
 *        '400':
 *          description: Error creating new user
 */

router.post("/", async (req, res) => {
  try {
    const newUser = await UserSchema.create(req.body);
    return res.send(newUser);
  } catch (err) {
    return res.status(400).send({ error: "Error creating new user" });
  }
});


/**
 * @swagger
 * /user/{userId}:
 *  put:
 *    tags:
 *    - user
 *    summary: Updated user
 *    description: Update the user info in according to the userId on path
 *    operationId: updateUser
 *    parameters:
 *      - name: userId
 *        in: path
 *        description: refferrence to the user object which it's info needs to be updated 
 *        required: true
 *        type: string
 *      - in: body
 *        name: body
 *        description: Update user object
 *        required: true
 *        schema:
 *          $ref: '#/definitions/User'
 *        responses:
 *          '200':
 *            description: okay
 *          '400': 
 *            description: Error updating user
 */

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


/**
 * @swagger
 * /user/{userId}:
 *  delete:
 *    tags:
 *    - user
 *    summary: Delete user
 *    description: Delete the user object in according to the userId on path
 *    operationId: deleteUser
 *    parameters:
 *      - name: userId
 *        in: path
 *        description: refferrence to the user object which will be deleted 
 *        required: true
 *        type: string
 *        responses:
 *          '200':
 *            description: User deleted            
 *          '400': 
 *            description: Error deleting user
 */
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
