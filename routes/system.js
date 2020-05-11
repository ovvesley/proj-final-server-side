/**
 * Module responsible for managing the system route
 * Check the documentation on swagger
 * 
 * @file
 * @module
 * @author Enzo Zamora <enzozamora@gmail.com>
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SystemModel = require("../models/System");

const errorHandler = (err, op) =>{
    return objError = {
        error: err,
        msg: `Erro na ${op} do sistema! Tente novamente mais tarde`
    }
}

const reqBodyIsEmpty = (body) =>{
    if(body.constructor === Object && Object.keys(body).length === 0)
     return true; 
}

/**Cria System */
router.post("/", async (req, res) => {
    const op = 'criação';
    try {
        const {nameSystem, category, microcontrollers} = req.body;
        console.log(nameSystem,microcontrollers, category);
        console.log(microcontrollers);
        if(!nameSystem){
            let responseObj = {
                error: "Forbidden",
                msg: "Certifique de fornecer um nome para o Sistema!"
            };
            if(reqBodyIsEmpty(req.body)){
                responseObj.msg = `Você não forneceu nenhum dado para ${op} do Sistema`
            }
                return res.status(403).send(responseObj);
        }
        else if (await SystemModel.findOne({nameSystem:nameSystem})){
            return res.status(403).send({
                error:"Forbidden",
                msg: `O nome de sistema '${nameSystem}' já está em uso. Escolha outro!`
            });
        }
        else{
            const systemCreated  = await SystemModel.create(req.body);
            const responseObj = {
                status: 'Success',
                msg: `Sistema [${systemCreated.nameSystem}] criado com sucesso`,
                system : systemCreated
            };
            res.status(200).send(responseObj);
        }
    }catch (err) {
        res.status(400).send(errorHandler(err.message, op));
    }
});

/**Update System */
router.put("/:systemId", async(req, res)=> {
    const op = 'atualização';
    try {
        if(reqBodyIsEmpty(req.body)){
            res.status(403).send({
                error:"Forbidden",
                msg:"Forneça dados para atualizar seu Sistema!"
            });
        }
        else if(await SystemModel.findOne({nameSystem:req.body.nameSystem})){
            res.status(403).send({
                error:"Forbidden",
                msg:`Já existe um Sistema com nome [ ${req.body.nameSystem} ]! Escolha outro nome!`
            });
        }
        else{
            /**Dados serão atualizados */
            const currentSystem = await SystemModel.findById(req.params.systemId);

            for (const prop in req.body) {
                if (req.body.hasOwnProperty(prop)) {
                  currentSystem[prop] = req.body[prop];
                }
            }
            currentSystem.save();
            res.status(200).send({
                status:"Success",
                msg: `Sistema [ ${req.body.nameSystem} ] atualizado com sucesso!`,
                system: currentSystem
            });
        }
    } catch (err) {
        res.status(400).send(errorHandler(err.message, op));
    }
});

/**Delete system */
router.delete("/:systemId", async(req, res) => {
    const op = 'exclusão';
    try {
        const id = mongoose.Types.ObjectId(req.params.systemId);
        if(!await SystemModel.findById(id)){
            return res.status(410).send({
                error:"Sistema inexistente!",
                msg: "Não existe Sistema correspondente para efetuar exclusão!"
            });
        }
        else{
            let systemRemoved = await SystemModel.findByIdAndDelete(id);
            return res.status(200).send({
                status:"Success",
                msg: `Sistema [${systemRemoved.nameSystem}] deletado com sucesso`
            });
        }
    } catch (err){
        console.log(err);
        return res.status(400).send(errorHandler(err.message, op));
    }
});

/**Not found */
router.use("/", async (req, res)=> {
    res.status(404);
    res.send( {
      error: "Not found",
      msg: "Endpoint não disponível!"
    });
  });

module.exports = router;