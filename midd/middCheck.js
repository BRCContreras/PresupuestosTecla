const Joi = require('@hapi/joi')
module.exports = {

    modeloLogin : Joi.object().keys({
        email:Joi.string().email().required(),
        contrasena: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
    }).with('email', 'contrasena'),

    modeloRegistro : Joi.object().keys({
        nombre: Joi.string().required().max(40),
        apellidos: Joi.string().required().max(40),
         email:Joi.string().email().required(),
         bandera_admin:Joi.required(),
         contrasena: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
     }).with('email', 'contrasena')
}