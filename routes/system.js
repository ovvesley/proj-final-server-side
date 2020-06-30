/**
 * Module responsible for managing the system route
 * Check the documentation on swagger
 *
 * @file
 * @module
 * @author Enzo Zamora <enzozamora@gmail.com>
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const SystemModel = require("../models/System");

const errorHandler = (err, op) => {
  return (objError = {
    error: err,
    msg: `Erro na ${op} do sistema! Tente novamente mais tarde`,
  });
};

const reqBodyIsEmpty = (body) => {
  if (body.constructor === Object && Object.keys(body).length === 0) {
    return true;
  }
};

/**
 * @swagger
 * /system:
 *  post:
 *    tags:
 *    - system
 *    summary: Creates a system
 *    description: Create a new system and save it on the database
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    operationId: createSystem
 *    parameters:
 *    - in: body
 *      name: body
 *      description: System object to be created and saved on database
 *      required: true
 *      schema:
 *        $ref: '#/definitions/SystemInfoReqRes'
 *
 *    responses:
 *      200:
 *        description: Success on creating the new system. Returns the new system too
 *        schema:
 *          $ref: '#/definitions/SuccessCreateSystem'
 *
 *      400:
 *        description: Bad request. Error creating the System.
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 *
 *      403:
 *        description: Forbidden request. You didn't supply any data to the body, fogot the required one (nameSystem) or the name chosen is already being used
 *        schema:
 *          $ref: "#/definitions/ErrorRequest"
 */

router.post("/", async (req, res) => {
  const op = "criação";
  try {
    const { nameSystem, category, microcontrollers, userId } = req.body;
    if (!nameSystem || !userId) {
      let responseObj = {
        error: "Forbidden",
        msg: "Certifique de fornecer um nome para o Sistema!",
      };
      if (!userId) {
        responseObj.msg = `Você não forneceu o userId para ${op} do Sistema`;
      }
      if (reqBodyIsEmpty(req.body)) {
        responseObj.msg = `Você não forneceu nenhum dado para ${op} do Sistema`;
      }

      return res.status(403).send(responseObj);
    } else if (await SystemModel.findOne({ nameSystem: nameSystem })) {
      return res.status(403).send({
        error: "Forbidden",
        msg: `O nome de sistema '${nameSystem}' já está em uso. Escolha outro!`,
      });
    } else {
      const systemCreated = await SystemModel.create(req.body);
      const responseObj = {
        status: "Success",
        msg: `Sistema [${systemCreated.nameSystem}] criado com sucesso`,
        system: systemCreated,
      };
      res.status(200).send(responseObj);
    }
  } catch (err) {
    res.status(400).send(errorHandler(err.message, op));
  }
});

/**
 * @swagger
 * /system/{systemId}:
 *  put:
 *    tags:
 *    - system
 *    summary: Updates a system
 *    description: Update the system info in database according to the systemId on path
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    operationId: updateSystem
 *    parameters:
 *      - name: systemId
 *        in: path
 *        description: refferrence to the system object which it's info needs to be updated
 *        required: true
 *        type: string
 *      - in: body
 *        name: body
 *        description: Updated system object.
 *        required: true
 *        schema:
 *          $ref: '#/definitions/SystemInfoReqRes'
 *
 *    responses:
 *      200:
 *        description: System info updated
 *        schema:
 *          $ref: '#/definitions/SuccessUpdateSystem'
 *
 *
 *      400:
 *        description: Bad request, error updating system.
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 *
 *      403:
 *        description: Forbidden request. Didn't supply the request body or the new nameSystem supplied for the update is already being used.
 *        schema:
 *          $ref: '#/definitions/ErrorRequest'
 */

router.put("/:systemId", async (req, res) => {
  const op = "atualização";
  try {
    if (reqBodyIsEmpty(req.body)) {
      res.status(403).send({
        error: "Forbidden",
        msg: "Forneça dados para atualizar seu Sistema!",
      });
    } else if (await SystemModel.findOne({ nameSystem: req.body.nameSystem })) {
      res.status(403).send({
        error: "Forbidden",
        msg: `Já existe um Sistema com nome [ ${req.body.nameSystem} ]! Escolha outro nome!`,
      });
    } else {
      /**Dados serão atualizados */
      const currentSystem = await SystemModel.findById(req.params.systemId);

      for (const prop in req.body) {
        if (req.body.hasOwnProperty(prop)) {
          currentSystem[prop] = req.body[prop];
        }
      }
      currentSystem.save();
      res.status(200).send({
        status: "Success",
        msg: `Sistema [ ${req.body.nameSystem} ] atualizado com sucesso!`,
        system: currentSystem,
      });
    }
  } catch (err) {
    res.status(400).send(errorHandler(err.message, op));
  }
});

/**
 * @swagger
 * /system/{systemId}:
 *    delete:
 *      tags:
 *      - system
 *      summary: Deletes a system
 *      description: Deletes the system object in according to the systemId on path.
 *      operationId: deleteSystem
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - name: systemId
 *        in: path
 *        description: System's id to delete
 *        required: true
 *
 *      responses:
 *        200:
 *          description: Success on deleting the system
 *          schema:
 *            $ref: '#/definitions/SuccessGeneralMessage'
 *
 *        400:
 *          description: Error deleting system. Invalid id supplied
 *          schema:
 *            $ref: '#/definitions/ErrorRequest'
 *
 */

router.delete("/:systemId", async (req, res) => {
  const op = "exclusão";
  try {
    const id = mongoose.Types.ObjectId(req.params.systemId);
    if (!(await SystemModel.findById(id))) {
      return res.status(410).send({
        error: "Sistema inexistente!",
        msg: "Não existe Sistema correspondente para efetuar exclusão!",
      });
    } else {
      let systemRemoved = await SystemModel.findByIdAndDelete(id);
      return res.status(200).send({
        status: "Success",
        msg: `Sistema [${systemRemoved.nameSystem}] deletado com sucesso`,
      });
    }
  } catch (err) {
    return res.status(400).send(errorHandler(err.message, op));
  }
});

/**Not found */
router.use("/", async (req, res) => {
  res.status(404);
  res.send({
    error: "Not found",
    msg: "Endpoint não disponível!",
  });
});

module.exports = router;
