const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = require("../../models/User");
const bcrypt = require('bcrypt');

const showUserInfo = (user) => {
    let {password, ...userInfo} = user;
    password = null;
    return userInfo;
}
/**
 * Assumir: req.body tem login e password
 */
router.post( "/", async (req, res) => {
    //res.status(200).send({msg:"Tentou post né safadinho"});
    /**Missing data 
     * objRespMissing = {
     *  error:
     *  msg:
     * }  
     * if(faltou tudo)
     *  obRespMissing.msg = "TU ESQUECEU A PORRA TODA NÉ";
     * ENZOOO CADE VC ALOOOO ENZO A STREAM CAIU 
     * CALMA
     * CALMA
     * kkkkk
     * res.status(403).send(objRespMissing);
    */
    try{
        const {login , password} = req.body;
        if(!login || !password){
            let objResMissing = {
                error: "Forbidden",
                msg: "Esqueceu UMA coisa"
            };
            if(req.body.constructor === Object && Object.keys(req.body).length === 0)
                objResMissing.msg = "Esqueceu TUDO";
            return  res.status(403).send(objResMissing);
        }
        
    /**
        * Incorrect Data
        *  1. Se existe user com aquele login
        *  2. Se a senha bate com o usuário do login
        *      
        * 
        */  

        else if(!await UserModel.findOne({login: login})){
            console.log('Nao achamos nada com esse login');
            res.status(403).send({
                error: "Forbidden",
                msg:"Login e/ou senha incorreto(s)"});

        }
        else{
            let currentUser = await UserModel.findOne({login:login});
            if(!bcrypt.compareSync(password, currentUser.password)){
                res.status(403).send({
                    error: "Forbidden",
                    msg: "Login e/ou senha incorreto(s)!"
                });
            }
            else{
                res.status(200).send({
                    status:"Success",
                    msg:"Login efetuado com sucesso!",
                    user: showUserInfo(currentUser._doc)
                });
            }
        }
    }
    catch(err){
        console.log(err);
        res.status(400).send({
            err: err.message,
            msg: "Algo deu errado! Tente novamente mais tarde!"
        });
    }    
});




router.use("/", (req, res)=> {
    res.status(404).send({
        error: "Not found!",
        msg: "Endpoint não disponível",
    });
});




module.exports = router;