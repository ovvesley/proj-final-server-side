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
    const { login, password } = req.body;
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: "Você não forneceu os dados para criar a conta!",
      });
    }
    if (!login || !password) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: "Certifique-se de fornecer login e senha!",
      });
    } else if (await UserModel.findOne({ login: login })) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: `O usuário ${login} já existe. Escolha outro!`,
      });
    } else {
      var newUser = new UserModel(req.body);
      newUser.password = newUser.generateHash(password);
      let userCreated = await UserModel.create(newUser);
      console.log(userCreated);
      //console.log(newUser);
      if (!req.body.admin) {
        return res.send({
          status: "Success",
          msg: `Usuário ${login} criado com sucesso`,
          user: userCreated,
        });
      } else {
        return res.send({
          status: "Success",
          msg: `Usuário Administrador ${login} criado com sucesso`,
          user: userCreated,
        });
      }
    }
  } catch (err) {
    return res.status(400).send({
      status: "Bad Request!",
      msg: `Algo deu errado :(
         Tente novamente!`,
      errorMessage: err.message,
    });
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
    let currentUser = await UserModel.findOne({
      _id: req.params.userId,
    });
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(403);
      return res.send({
        error: "No content",
        msg: "Forneça dados para serem atualizados!",
      });
    }else if(await UserModel.findOne({login: req.body.login})){
        res.status(403);
        return res.send({
          error:"Forbidden",
          msg:"Login já existente! Escolha outro login!"
        });
    }
    else{
      for (const prop in req.body) {
        if (req.body.hasOwnProperty(prop) && prop !== "password") {
          console.log(prop +':'+ req.body[prop]);
          currentUser[prop] = req.body[prop];
        }
        else{
          var tentarTrocarSenha = true;  
        }
      }
      currentUser.save();
      res.status(200);
      if(tentarTrocarSenha){
        return res.send({
          msg: `Usuário ${req.body.login} atualizado com sucesso, exceto a senha. Não é possível alterar a senha de um usuário!`,
          user: currentUser, 
        });
      }
      else{
        res.status(200);
        return res.send({
          status:'Success',
          msg: `Usuário ${req.body.login} atualizado com sucesso!`,
          user: currentUser,
        });
      }
    }
  } 
  catch (err) {
    console.log(err);
    return res.status(400).send({
      error: 'Bad request!',
      msg: "Erro na atualização do usuário",
    });
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
    res.status(200);
    return res.send({
      status: "Success",
      msg: "Usuário removido com sucesso!",
    });
  } catch (err) {
    return res.status(400).send({
      error: "Bad request",
      msg: "Erro na exclusão do usuário!",
    });
  }
});

module.exports = router;