/**
 *
 * This module is responsible for managing the user routes
 * Check the documentation on swagger
 *
 * @file
 * @module
 * @author Gabriel Amaral <biel.ilha2021@gmail.com>
 */

var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var MicrocontrollerModel = require("../models/Microcontroller");

/**
 * @swagger
 * /microcontroller:
 *  post:
 *    tags:
 *    - microcontroller
 *    summary: Creates a microcontroller
 *    description: Create a new microcontroller and save it on the database
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    operationId: createMicrocontroller
 *    parameters:
 *    - in: body
 *      name: body
 *      description: Microcontroller object to be created and saved on database
 *      required: true
 *      schema:
 *        $ref: '#/definitions/MicrocontrollerInfoReqRes'
 *
 *    responses:
 *      200:
 *        description: Success on creating the new microcontroller. Returns the new microcontroller too
 *        schema:
 *          $ref: '#/definitions/SuccessCreateMicrocontroller'
 *
 *      400:
 *        description: Bad request. Error creating the microcontroller.
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 *
 *      403:
 *        description: Forbidden request. You didn't supply any data to the body, fogot the required one (nameSystem) or the name chosen is already being used by another microcontroller
 *        schema:
 *          $ref: "#/definitions/ErrorRequest"
 */

router.post("/", async (req, res) => {
  try {
    const { nameMicrocontroller, type, sensors } = req.body;
    /**Caso não forneça dados pra criar o microcontrolador*/

    if (!nameMicrocontroller || !type) {
      let responseObj = {
        error: "Forbidden",
        msg: "Certifique-se de fornecer o nome e o tipo!",
      };
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        responseObj.msg =
          "Você forneceu nada para criação do microcontrolador!";
      }
      return res.status(403).send(responseObj);
    } else if (
      /**Caso o nome fornecido já exista */
      await MicrocontrollerModel.findOne({
        nameMicrocontroller: nameMicrocontroller,
      })
    ) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: `O nome ${nameMicrocontroller} já existe. Escolha outro!`,
      });
    } else {
      /** Deu tudo certo, partindo para criação */
      var newMicrocontroller = new MicrocontrollerModel(req.body);
      let microcontrollerCreated = await MicrocontrollerModel.create(
        newMicrocontroller
      );
      console.log(
        `--Micro [ ${nameMicrocontroller} ] cadastrado na plataforma.`
      );
      res.status(200);
      return res.send({
        status: "Success",
        msg: `Microcontrolador [ ${nameMicrocontroller} ] criado com sucesso`,
        microcontroller: microcontrollerCreated,
      });
    }
  } catch (err) {
    /**Deu ruim lek! */
    return res.status(400).send({
      error: err.message,
      msg: `Erro na criação do microcontroller! Tente novamente mais tarde`,
    });
  }
});

/**
 * @swagger
 * /microcontroller/{microcontrollerId}:
 *  put:
 *    tags:
 *    - microcontroller
 *    summary: Updates a microcontroller
 *    description: Update the microcontroller info in database according to the microcontrollerId on path
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    operationId: updateMicrocontroller
 *    parameters:
 *      - name: microcontrollerId
 *        in: path
 *        description: refferrence to the microcontroller object which it's info needs to be updated
 *        required: true
 *        type: string
 *      - in: body
 *        name: body
 *        description: Microcontroller object new info to be updated.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/MicrocontrollerInfoReqRes'
 *
 *    responses:
 *      200:
 *        description: Microcontroller info updated
 *        schema:
 *          $ref: '#/definitions/SuccessUpdateMicrocontroller'
 *
 *
 *      400:
 *        description: Bad request, error updating microcontroller.
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 *
 *      403:
 *        description: Forbidden request. Didn't supply the request body or the new name supplied for update is already being used by another microcontroller.
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 */

router.put("/:microcontrollerId", async (req, res) => {
  try {
    let currentMicrocontroller = await MicrocontrollerModel.findOne({
      _id: req.params.microcontrollerId,
    });
    /**Caso não tenha sido fornecido dados para atualização */
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: "Forneça dados para serem atualizados!",
      });
    } /**Caso o nome fornecido pertença a outro user */ else if (
      await MicrocontrollerModel.findOne({
        nameMicrocontroller: req.body.nameMicrocontroller,
      })
    ) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: "Nome já existente! Escolha outro nome!",
      });
    } else {
      /**Os dados serão atualizados*/
      console.log(
        `\n  Microcontrolador [ ${currentMicrocontroller.nameMicrocontroller} ] sendo atualizado na plataforma.\n`
      );

      for (const prop in req.body) {
        if (req.body.hasOwnProperty(prop)) {
          currentMicrocontroller[prop] = req.body[prop];
        }
      }
      /**Saved on database */
      currentMicrocontroller.save();
      console.log(
        `\n --user> Usuario [ ${currentMicrocontroller.name} ] atualizado com sucesso na plataforma.\n`
      );

      let responseObj = {
        status: "Success",
        msg: `Microcontrolador [ ${currentMicrocontroller.nameMicrocontroller} ] atualizado com sucesso!`,
        microcontroller: currentMicrocontroller,
      };

      res.status(200).send(responseObj);
    }
  } catch (err) {
    /**Something went wrong */
    return res.status(400).send({
      error: err.message,
      msg:
        "Erro na atualização do Microcontrolador! Tente novamente mais tarde",
    });
  }
});

/**
 * @swagger
 * /microcontroller/{microcontrollerId}:
 *    delete:
 *      tags:
 *      - microcontroller
 *      summary: Deletes a microcontroller
 *      description: Deletes the microcontroller object in according to the microcontrollerId on path.
 *      operationId: deleteMicrocontroller
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - name: microcontrollerId
 *        in: path
 *        description: Microcontroller's id to delete
 *        required: true
 *
 *      responses:
 *        200:
 *          description: Success on deleting the microcontroller
 *          schema:
 *            $ref: '#/definitions/SuccessGeneralMessage'
 *
 *        400:
 *          description: Error deleting microcontroller. Invalid id supplied
 *          schema:
 *            $ref: '#/definitions/ErrorRequest'
 *
 */

router.delete("/:microcontrollerId", async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.microcontrollerId);
    let microcontrollerRemoved = await MicrocontrollerModel.findByIdAndRemove(
      id
    );
    console.log(
      `\n Micro [ ${microcontrollerRemoved.nameMicrocontroller} ] removido da plataforma.\n`
    );
    res.status(200);
    return res.send({
      status: "Success",
      msg: `Microcontrolador ${microcontrollerRemoved.nameMicrocontroller} removido com sucesso!`,
    });
  } catch (err) {
    return res.status(400).send({
      error: err.message,
      msg: "Erro na exclusão do microcontrolador! Tente novamente mais tarde",
    });
  }
});

module.exports = router;
