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
        const {nameSystem:name, category, microcontrollers} = req.body;
        console.log(name,microcontrollers, category);
        console.log(microcontrollers);
        if(!name){
            let responseObj = {
                error: "Forbidden",
                msg: "Certifique de fornecer um nome para o sistema!"
            };
            if(reqBodyIsEmpty(req.body)){
                responseObj.msg = `Você não forneceu nenhum dado para ${op} do sistema`
            }
                return res.status(403).send(responseObj);
        }
        else if (await SystemModel.findOne({nameSystem:name})){
            return res.status(403).send({
                error:"Forbidden",
                msg: `O nome de sistema '${name}' já está em uso. Escolha outro!`
            });
        }
        else{
            const systemCreated  = await SystemModel.create(req.body);
            const responseObj = {
                status: 'Success',
                msg: `Sistema [${name} criado com sucesso]`,
                system : systemCreated
            };
            res.status(200).send(responseObj);
        }
    }catch (err) {
        res.status(400).send(errorHandler(err.message, op));
    }
})

/**Update System */

/**Deleta system */


module.exports = router;