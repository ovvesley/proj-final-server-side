/**
 * This module is responsible for managing the user sign.
 * Mainly used by the frontend in the user registry.
 *
 * @file
 * @module
 * @author Wesley Ferreira <wsf.ley@gmail.com>
 */
var express = require("express");

var User = require("../../models/User");

const router = express.Router();

/**
 * @swagger
 * /signUp:
 *    post:
 *      tags:
 *      - services
 *      summary: Create a user via singUp page
 *      description: Register a new user on the database via sign up page
 *      consumes:
 *      - "application/json"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: body
 *        name: body
 *        description: User object to create
 *        required: true
 *        schema:
 *          $ref: "#/definitions/UserSignUp"
 *
 *      responses:
 *        200:
 *          description: Success on creating the new user
 *          schema:
 *            $ref: '#/definitions/SuccessMessageSingUp'
 *
 *        403:
 *          description: Error deleting user
 *          schema:
 *            $ref: '#/definitions/ErrorMessageSingUp'
 *
 */
router
  .route("/")
  .get((req, res) => {
    res.statusCode = 404;
    return res.json({
      error: "not found",
      msg: "Endpoint não disponível",
    });
  })
  .post(async (req, res, next) => {
    let { login, password, repassword } = req.body;

    if (!login && !password && !repassword) {
      res.statusCode = 403;
      return res.json({
        error: "unauthorized",
        msg: "Ocorreu um erro no cadastro. Por favor tente novamente.",
      });
    }

    if (password !== repassword) {
      res.statusCode = 403;
      return res.json({
        error: "Passwords entered do not match",
        msg: "Senhas informadas não coincidem. Por favor, tente novamente",
      });
    }

    try {
      let user = await User.findOne({ login }, (err) => {
        if (err) {
          res.json({
            error: err,
            msg: "Ocorreu um erro no sistema. Por favor tente mais tarde.",
          });
        }
      }).exec();

      if (user) {
        res.statusCode = 403;
        res.json({
          error: "There is a user with this login in the system",
          msg: `Já existe um usuario com o login '${login}'. Tente outro por favor.`,
        });
      } else {
        var newUser = new User({ login });
        newUser.password = newUser.generateHash(password);
        await newUser.save();
        console.log(`--signUp> Usuario [ ${login} ] iniciou um cadastro na plataforma.`);
        return res.json({
          status: "success",
          msg: "Usuario cadastrado com sucesso.",
        });
      }
    } catch (error) {
      res.statusCode = 500;
      return res.json({
        error: error.message,
        msg: "Ocorreu um erro no sistema. Por favor tente mais tarde.",
      });
    }
  })
  .put((req, res) => {
    res.statusCode = 404;
    return res.json({
      error: "not found",
      msg: "Endpoint não disponível",
    });
  })
  .delete((req, res) => {
    res.statusCode = 404;
    return res.json({
      error: "not found",
      msg: "Endpoint não disponível",
    });
  });

module.exports = router;
