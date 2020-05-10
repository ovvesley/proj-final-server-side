/**
 * This module is responsible for managing the user routes
 * Check the documentation on swagger
 *
 * @file
 * @module
 * @author Gabriel Amaral <biel.ilha2021@gmail.com>
 * @author Enzo Zamora <enzozamora@gmail.com>
 */

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
 *    summary: Creates a user
 *    description: Create a new user and save it on the database
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    operationId: createUser
 *    parameters:
 *    - in: body
 *      name: body
 *      description: User object to be created and saved on database
 *      required: true
 *      schema:
 *        $ref: '#/definitions/UserInfoReqRes'
 * 
 *    responses:
 *      200:
 *        description: Success on creating the new user. Returns the new user too
 *        schema: 
 *          $ref: '#/definitions/SuccessCreateUser'
 * 
 *      400:
 *        description: Bad request. Error creating the user.
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 * 
 *      403:
 *        description: Forbidden request. You didn't supply any data to the body, fogot the required ones (login and password) or the login chosen is already being used
 *        schema:
 *          $ref: "#/definitions/ErrorRequest"
 */


const showUserInfo = (user) =>{
  let {password, ...userInfo} = user._doc;
  password = null;
  return userInfo;
}


router.post("/", async (req, res) => {
  try {
    const { login, password } = req.body;
    /**Caso não forneça dados pra criar conta*/

    if (!login || !password) {
      
      let responseObj = {
        error:"Forbidden",
        msg:"Certifique-se de fornecer login e senha!"
      };
      if (req.body.constructor === Object && Object.keys(req.body).length === 0){
        responseObj.msg = "Você não forneceu nenhum dado para criação do usuário!";
      }
      return res.status(403).send(responseObj);
    }
    /**Caso o login fornecido já exista */
    else if (await UserModel.findOne({ login: login })) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: `O usuário ${login} já existe. Escolha outro!`,
      });
    }
    /** Deu tudo certo, partindo para criação */ 
    else {
      var newUser = new UserModel(req.body);
      newUser.password = newUser.generateHash(password);
      let userCreated = await UserModel.create(newUser);
      console.log(`--user> Usuario [ ${login} ] cadastrado na plataforma.`);

      let responseObj = {
        status: "success", 
        msg: `Usuário [ ${login} ] criado com sucesso`, 
        user: showUserInfo(userCreated)
      };

      /**Caso seja admin */
      if(req.body.admin)
        responseObj.msg = `ADMIN [ ${login} ] criado com sucesso`;
      res.send(responseObj);
    }

  } catch (err) { /**Something went wrong! */
    return res.status(400).send({
      error: err.message,
      msg: `Erro na criação do usuário! Tente novamente mais tarde`,
    });
  }
});

/**
 * @swagger
 * /user/{userId}:
 *  put:
 *    tags:
 *    - user
 *    summary: Updates a user
 *    description: Update the user info in database according to the userId on path
 *    consumes: 
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    operationId: updateUser
 *    parameters:
 *      - name: userId
 *        in: path
 *        description: refferrence to the user object which it's info needs to be updated
 *        required: true
 *        type: string
 *      - in: body
 *        name: body
 *        description: Updated user object.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/UserInfoReqRes'
 * 
 *    responses:
 *      200:
 *        description: User info updated, except the password. [Can't update password]
 *        schema: 
 *          $ref: '#/definitions/SuccessUpdateUser'
 *          
 * 
 *      400:
 *        description: Bad request, error updating user.
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 *            
 *      403:
 *        description: Forbidden request. Didn't supply the request body or the new login supplied for update is already being used.
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 */

router.put("/:userId", async (req, res) => {
  try {
    let currentUser = await UserModel.findOne({_id: req.params.userId,});
    /**Caso não tenha sido fornecido dados para atualização */
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: "Forneça dados para serem atualizados!",
      });
    }/**Caso o login fornecido pertença a outro user */
    else if(await UserModel.findOne({login: req.body.login})){
        res.status(403);
        return res.send({
          error:"Forbidden",
          msg:"Login já existente! Escolha outro login!"
        });
    }
    else{
      /**Os dados serão atualizados*/
      console.log(`\n --user> Usuario [ ${currentUser.login} ] sendo atualizado na plataforma.\n`);
      
      for (const prop in req.body) {
        if (req.body.hasOwnProperty(prop) && prop !== "password") {
          currentUser[prop] = req.body[prop];
        }
        else if(prop =="password"){
          var tentarTrocarSenha = true;  
        }
      }
      /**Saved on database */
      currentUser.save();
      console.log(`\n --user> Usuario [ ${currentUser.login} ] atualizado com sucesso na plataforma.\n`);
      
      let responseObj = {
        status: "Success",
        msg: `Usuário [ ${currentUser.login} ] atualizado com sucesso!`,
        user: showUserInfo(currentUser)
      };
      
      /**Caso tenha tentado trocar a senha, obterá uma mensagem diferente! */
      if(tentarTrocarSenha){
        responseObj.msg = `Usuário [ ${currentUser.login} ] atualizado com sucesso, exceto a senha. Não é possível alterar a senha de um usuário!`;
      }

      res.status(200).send(responseObj);
    }
  } catch (err) { /**Something went wrong */
    return res.status(400).send({
      error: err.message,
      msg: "Erro na atualização do usuário! Tente novamente mais tarde",
    });
  }
});

/**
 * @swagger
 * /user/{userId}:
 *    delete:
 *      tags:
 *      - user
 *      summary: Deletes a user
 *      description: Deletes the user object in according to the userId on path.
 *      operationId: deleteUser
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - name: userId
 *        in: path
 *        description: User's id to delete
 *        required: true
 *   
 *      responses:
 *        200:
 *          description: Success on deleting the user
 *          schema:
 *            $ref: '#/definitions/SuccessGeneralMessage'
 *
 *        400:
 *          description: Error deleting user. Invalid id supplied
 *          schema:
 *            $ref: '#/definitions/ErrorRequest'
 *
 */
 
router.delete("/:userId", async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.userId);
    let userRemoved = await UserModel.findByIdAndRemove(id);
    console.log(`\n--user> Usuario [ ${userRemoved.login} ] removido da plataforma.\n`);
    res.status(200);
    return res.send({
      status: "Success",
      msg: `Usuário ${userRemoved.login} removido com sucesso!`,
    });
  } catch (err) {
    return res.status(400).send({
      error: err.message,
      msg: "Erro na exclusão do usuário! Tente novamente mais tarde",
    });
  }
});

router.use("/", async (req, res)=> {
  res.status(404);
  res.send( {
    error: "Not found",
    msg: "Endpoint não disponível!"
  });
});

module.exports = router;