var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var SensorModel = require("../models/Sensor");

/**
 * @swagger
 * /sensor/:
 *    post:
 *      tags:
 *      - sensor
 *      summary: create a sensor
 *      description: create a sensor in the system
 *      operationId: create sensor
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: body
 *        name: body
 *        description: sensor object to create
 *        required: true
 *        schema:
 *          $ref: "#/definitions/SuccessCreateSensor"
 *      responses:
 *        200:
 *          description: Success in creating sensor
 *          schema:
 *            $ref: '#/definitions/Sensor'
 *
 */

router.post("/", async (req, res) => {
  try {
    const { nameSensor, digitalValue, analogValue, portNumber } = req.body;
    /**Caso não forneça dados pra criar o Sensor*/

    if (!nameSensor) {
      let responseObj = {
        error: "Forbidden",
        msg: "Certifique-se de fornecer o nome!",
      };
      if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        responseObj.msg = "Você forneceu nada para criação do Sensor!";
      }
      return res.status(403).send(responseObj);
    } else if (
      /**Caso o nome fornecido já exista */
      await SensorModel.findOne({
        nameSensor: nameSensor,
      })
    ) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: `O nome ${nameSensor} já existe. Escolha outro!`,
      });
    } else {
      /** Deu tudo certo, partindo para criação */
      var newSensor = new SensorModel(req.body);
      let sensorCreated = await SensorModel.create(newSensor);
      console.log(`--Sensor [ ${nameSensor} ] cadastrado na plataforma.`);
      res.status(200);
      return res.send({
        status: "Success",
        msg: `Sensor [ ${nameSensor} ] criado com sucesso`,
        sensor: sensorCreated._doc,
      });
    }
  } catch (err) {
    /**Deu ruim lek! */
    return res.status(400).send({
      error: err.message,
      msg: `Erro na criação do sensor! Tente novamente mais tarde`,
    });
  }
});

/**
 * @swagger
 * /sensor/:
 *    put:
 *      tags:
 *      - sensor
 *      summary: update a sensor
 *      description: update a sensor in the system
 *      operationId: update sensor
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: body
 *        name: body
 *        description: sensor object to update
 *        required: true
 *        schema:
 *          $ref: "#/definitions/SuccessUpdateSensor"
 *      responses:
 *        200:
 *          description: Success in updating sensor
 *          schema:
 *            $ref: '#/definitions/Sensor'
 *
 */
router.put("/:sensorId", async (req, res) => {
  try {
    let currentSensor = await SensorModel.findOne({ _id: req.params.sensorId });
    /**Caso não tenha sido fornecido dados para atualização */
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: "Forneça dados para serem atualizados!",
      });
    } /**Caso o nome fornecido pertença a outro sensor */ else if (
      await SensorModel.findOne({ nameSensor: req.body.nameSensor })
    ) {
      res.status(403);
      return res.send({
        error: "Forbidden",
        msg: "Nome já existente! Escolha outro nome!",
      });
    } else {
      /**Os dados serão atualizados*/
      console.log(`\n  Sensor [ ${currentSensor.nameSensor} ] sendo atualizado na plataforma.\n`);

      for (const prop in req.body) {
        if (req.body.hasOwnProperty(prop)) {
          currentSensor[prop] = req.body[prop];
        }
      }
      /**Saved on database */
      currentSensor.save();
      console.log(`\n --sensor> sensor [ ${currentSensor.name} ] atualizado com sucesso na plataforma.\n`);

      let responseObj = {
        status: "Success",
        msg: `Sensor [ ${currentSensor.nameSensor} ] atualizado com sucesso!`,
      };

      res.status(200).send(responseObj);
    }
  } catch (err) {
    /**Something went wrong */
    return res.status(400).send({
      error: err.message,
      msg: "Erro na atualização do Sensor! Tente novamente mais tarde",
    });
  }
});

/**
 * @swagger
 * /sensor/:
 *    delete:
 *      tags:
 *      - sensor
 *      summary: delete a sensor
 *      description: delete a sensor in the system
 *      operationId: delete a sensor
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: body
 *        name: body
 *        description: sensor object to delete
 *        required: true
 *        schema:
 *          $ref: "#/definitions/SuccessDeleteSensor"
 *      responses:
 *        200:
 *          description: Success in delete sensor
 *          schema:
 *            $ref: '#/definitions/Sensor'
 *
 */

router.delete("/:sensorId", async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.sensorId);
    let sensorRemoved = await SensorModel.findByIdAndRemove(id);
    console.log(`\n Sensor [ ${sensorRemoved.nameSensor} ] removido da plataforma.\n`);
    res.status(200);
    return res.send({
      status: "Success",
      msg: `Sensor ${sensorRemoved.nameSensor} removido com sucesso!`,
    });
  } catch (err) {
    return res.status(400).send({
      error: err.message,
      msg: "Erro na exclusão do Sensor! Tente novamente mais tarde",
    });
  }
});
module.exports = router;
