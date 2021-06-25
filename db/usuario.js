const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('./conexion');


//Definicion del modelo de usuario
const Usuario = sequelize.define('usuarios', {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    nombre: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING(80),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    bandera_admin: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    fechaAlta: {
        type: DataTypes.DATE,
        allowNull: false
    },
    idEstatus:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
})

module.exports = Usuario