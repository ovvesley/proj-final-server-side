/**
 * This module is responsible for managing the login for user.
 * Mainly used by the frontend in the user login.
 * 
 * @file
 * @module 
 * @author Enzo Zamora <enzozamora@gmail.com>
 * @author Gabriel Amaral <biel.ilha2021@gmail.com>
 */
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserModel = require("../../models/User");
const bcrypt = require("bcrypt");

const showUserInfo = (user) => {
  let { password, ...userInfo } = user;
  password = null;
  return userInfo;
};

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *    - services
 *    summary: Log the user in via log in page
 *    description: Receives the login and password request and compares with the database to log-in the user
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    operationId: login
 *    parameters:
 *    - in: body
 *      name: body
 *      description: Login and password for login
 *      required: true
 *      schema:
 *        $ref: '#/definitions/UserLogin'
 * 
 *    responses:
 *      200:
 *        description: Success on logging in the user.
 *        schema:
 *          $ref: '#/definitions/UserInfoReqRes'
 * 
 *      403: 
 *        description: Forbidden request. Didn't supply the request body or the login or password is wrong
 *        schema: 
 *          $ref: '#/definitions/ErrorRequest'
 * 
 *      400:
 *        description: Bad request. Error logging-in
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 *          
 *      
 *  
 */
router.post("/", async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      let objResMissing = {
        error: "Forbidden",
        msg: "Login ou senha não foram inseridos",
      };
      
      if (req.body.constructor === Object && Object.keys(req.body).length === 0)
        objResMissing.msg = "Passa";
      return res.status(403).send(objResMissing);

    } else if (!(await UserModel.findOne({ login: login }))) {
      console.log("Nao achamos nada com esse login");
      res.status(403).send({
        error: "Forbidden",
        msg: "Login e/ou senha incorreto(s)",
      });
    } else {
      let currentUser = await UserModel.findOne({ login: login });
      if (!bcrypt.compareSync(password, currentUser.password)) {
        res.status(403).send({
          error: "Forbidden",
          msg: "Login e/ou senha incorreto(s)!",
        });
      } else {
        res.status(200).send({
          status: "Success",
          msg: "Login efetuado com sucesso!",
          user: showUserInfo(currentUser._doc),
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      err: err.message,
      msg: "Algo deu errado! Tente novamente mais tarde!",
    });
  }
});

router.use("/", (req, res) => {
  res.status(404).send({
    error: "Not found!",
    msg: "Endpoint não disponível",
  });
});

module.exports = router;
