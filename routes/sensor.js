var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var SensorModel = require("../models/Sensor");

router.post("/", async (req, res) => {
  try {
    const { nameSensor, digitalValue, analogValue, portNumber } = req.body;
    /**Caso não forneça dados pra criar o Sensor*/

    if (!nameSensor) {
      let responseObj = {
        error: "Forbidden",
        msg: "Certifique-se de fornecer o nome!",
      };
      if (
        req.body.constructor === Object &&
        Object.keys(req.body).length === 0
      ) {
        responseObj.msg =
          "Você forneceu nada para criação do Sensor!";
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
      let sensorCreated = await SensorModel.create(
        newSensor
      );
      console.log(
        `--Sensor [ ${nameSensor} ] cadastrado na plataforma.`
      );
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

module.exports = router;
