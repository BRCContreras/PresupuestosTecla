const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')
const {modeloLogin} = require('./middCheck')

module.exports.verificacionUsuario = async (req,res,next) =>{
    let token = req.headers.authorization
    console.log(token)
    if (token != undefined){
        try{
        let tokenchk = token.split(' ')[1]
        let resultado = jwt.verify(tokenchk, process.env.SECRET_KEY)
        //console.log(resultado)
        if (resultado)
            return next
        else 
            throw new Error ('Token no valido')
        } catch (error) {
            console.log(error);
            res.status(400).json({error: 'No tienes autorización para ver esto :/'})
        } 
    }else {
        res.status(400).json('Este sistema es privado y seguro, necesita un Token para ingresar')
    }
}

module.exports.chkLogin = async (req,res,next)=> {
    try{
        await Joi.attempt(req.body, modeloLogin, 'Los datos ingresados no son correctos para el login')
        return next()
    }catch (err){
        console.log(err)
        res.status(500).json({error: err.message})
    }
}

module.exports.chkRegistro = async (req,res,next)=> {
    try{
        await Joi.attempt(req.body, modeloRegistro, 'Los datos ingresados no son correctos para el registro')
        return next()
    }catch (err){
        console.log(err)
        res.status(500).json({error: err.message})
    }
}