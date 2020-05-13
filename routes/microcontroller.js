var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var MicrocontrollerModel = require("../models/Microcontroller");

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
        microcontroller: microcontrollerCreated._doc,
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


router.put("/:microcontrollerId", async (req, res) => {
    try {
      let currentMicrocontroller = await MicrocontrollerModel.findOne({_id: req.params.microcontrollerId,});
      /**Caso não tenha sido fornecido dados para atualização */
      if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(403);
        return res.send({
          error: "Forbidden",
          msg: "Forneça dados para serem atualizados!",
        });
      }/**Caso o nome fornecido pertença a outro microcontroller */
      else if(await MicrocontrollerModel.findOne({nameMicrocontroller: req.body.nameMicrocontroller})){
          res.status(403);
          return res.send({
            error:"Forbidden",
            msg:"Nome já existente! Escolha outro nome!"
          });
      }
      else{
        /**Os dados serão atualizados*/
        console.log(`\n  Microcontrolador [ ${currentMicrocontroller.nameMicrocontroller} ] sendo atualizado na plataforma.\n`);
        
        for (const prop in req.body) {
          if (req.body.hasOwnProperty(prop)) {
            currentMicrocontroller[prop] = req.body[prop];
          }
        }
        /**Saved on database */
        currentMicrocontroller.save();
        console.log(`\n --microcontroller> microcontroller [ ${currentMicrocontroller.name} ] atualizado com sucesso na plataforma.\n`);
        
        let responseObj = {
          status: "Success",
          msg: `Microcontrolador [ ${currentMicrocontroller.nameMicrocontroller} ] atualizado com sucesso!`,
        };
  
        res.status(200).send(responseObj);
      }
    } catch (err) { /**Something went wrong */
      return res.status(400).send({
        error: err.message,
        msg: "Erro na atualização do Microcontrolador! Tente novamente mais tarde",
      });
    }
  });



router.delete("/:microcontrollerId", async (req, res) =>{
    try {
        const id = mongoose.Types.ObjectId(req.params.microcontrollerId);
        let microcontrollerRemoved = await MicrocontrollerModel.findByIdAndRemove(id);
        console.log(`\n Micro [ ${microcontrollerRemoved.nameMicrocontroller} ] removido da plataforma.\n`);
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
})

module.exports = router;
