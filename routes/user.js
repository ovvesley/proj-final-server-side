var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserModel = require("../models/User");

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
    const { 
      login, 
      password 
    } = req.body;
    if (!login || !password) {
      res.status(400);
      return res.send({
        msg: "Oops, you forgot the login or password!",
      });
    } else {
      var newUser = new UserModel(req.body);
      newUser.password = newUser.generateHash(password);
      await UserModel.create(req.body);
      console.log(newUser);
      return res.send({ message: "User created successfully", user: newUser });
    }
  } catch (err) {
    return res.status(400).send({ error: err.message });
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
    let currentUser = await UserModel.findOne({_id:req.params.userId});
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){ 
      res.status(406);
      return res.send({message: 'Insira informações para atualizar'});
    }

    for (const prop in req.body) {
      if (req.body.hasOwnProperty(prop) && prop !== 'password') {
        console.log(req.body[prop]);
        currentUser[prop] = req.body[prop];
      }
    }
    currentUser.save();

    res.status(200);
    return res.send({ message: `Usuário ${req.body.login} atualizado com sucesso`, user: currentUser});
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error updating user" });
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
    await UserModel.findByIdAndRemove(id);
    return res.send();
  } catch (err) {
    return res.status(400).send({ error: "Error deleting user" });
  }
});

module.exports = router;
