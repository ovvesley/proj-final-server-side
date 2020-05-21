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

router.put("/:sensorId", async (req, res) => {
    try {
      let currentSensor = await SensorModel.findOne({_id: req.params.sensorId,});
      /**Caso não tenha sido fornecido dados para atualização */
      if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(403);
        return res.send({
          error: "Forbidden",
          msg: "Forneça dados para serem atualizados!",
        });
      }/**Caso o nome fornecido pertença a outro sensor */
      else if(await SensorModel.findOne({nameSensor: req.body.nameSensor})){
          res.status(403);
          return res.send({
            error:"Forbidden",
            msg:"Nome já existente! Escolha outro nome!"
          });
      }
      else{
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
    } catch (err) { /**Something went wrong */
      return res.status(400).send({
        error: err.message,
        msg: "Erro na atualização do Sensor! Tente novamente mais tarde",
      });
    }
  });
module.exports = router;
