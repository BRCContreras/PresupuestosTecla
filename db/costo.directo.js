const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('./conexion');
const Presupuesto = require("./presupuesto");

const CostoDirecto = sequelize.define('costos_directos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    /*
    id_presupuesto: {
        type: Sequelize.INTEGER,
        references: {
            model: 'presupuestos',
            key: 'id'
        },
        allowNull: false        
    },*/
    concepto: {
        type: DataTypes.STRING(40),
        allowNull: true,        
    },
    opcion: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { 
    timestamps: false
});

let relacion = {
    foreignKey: {
        name: 'id_presupuesto',
        type: Sequelize.INTEGER,
        allowNull: false
    },
    onDelete: 'CASCADE'
};

Presupuesto.hasMany(CostoDirecto, relacion);
CostoDirecto.belongsTo(Presupuesto, relacion);

module.exports = CostoDirecto;