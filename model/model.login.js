const { DataTypes, Model } = require('sequelize')
const sequelize = require('../db/conexion');
const Usuarios = require('../db/usuario');


module.exports.existenciaDeUsuario = async (usr)=>{
    //chequear con la base de datos que exista el usuario
    //Usuario y pass
    //devuelvo un OK
    let resultado = await Usuarios.findOne({where: {email:usr.email, contrasena: usr.contrasena}})
    // null
    if (resultado === null){
        return false
    }else {
        return true
    }
}

module.exports.recuperarInfoUser = async (usr) => {
    let resultado = await Usuarios.findAll({where: {email:usr.email, contrasena: usr.contrasena}})
    if (resultado === null){
      return false
    }else {
      return resultado[0]
    }
}

module.exports.newUsuario = async (usr)=> {
    console.log(usr)
    let resultado = await Usuarios.create({nombre: usr.nombre, apellidos: usr.apellidos, email: usr.email , 
    movil: usr.movil, telefono: usr.telefono, ciudad: usr.ciudad, estado: usr.estado, cp: usr.cp,bandera_admin:usr.bandera_admin, contrasena: usr.contrasena,
    fechaAlta: usr.fechaAlta, idEstatus: usr.idEstatus  })

    return resultado

}

module.exports.modUsuario = async (usr) => {
  try {
    let resultado = await Usuarios.update({nombre: usr.nombre, apellidos: usr.apellidos, email: usr.email , 
      movil: usr.movil, telefono: usr.telefono, ciudad: usr.ciudad, estado: usr.estado, cp: usr.cp,bandera_admin:usr.bandera_admin, contrasena: usr.contrasena,
      fechaAlta: usr.fechaAlta, idEstatus: usr.idEstatus }, {where: { id : usr.id}})
    return resultado;
}catch (err){
    throw new Error ('No se pudo actualizar el producto seleccionado')
}
  }

module.exports.eliminarUsuario = async (id) => {
    try{
        let resultado = await Usuarios.destroy({
            where: { id: id }
        })
        return true
    }catch(error){
        throw console.log(error)
    }
  } 

  module.exports.listar = async ()=>{
    let resultado = await sequelize.query('SELECT * FROM usuarios')
    return resultado[0]
} 

module.exports.buscarUsuarios = async (data) => {
    try{
      let resultado = await Usuarios.findAll({
        where: { id : data }
      })
      return resultado[0]
    }catch (err) {
      throw new Error (err)
    }
  }