const jwt = require('jsonwebtoken');
const Presupuesto = require('../model/model.presupuesto');

module.exports.registrarPresupuesto = async (body,idUsuario) => {     
    const { proyecto, mes, año, datos } = body;
    let nuevoPresupuesto = new Presupuesto(proyecto, false, mes, año, datos);      
    try {
        let res = await nuevoPresupuesto.registrarPresupuesto(idUsuario);
        return res;
    } catch (error) {
        throw error;
    }    
}

module.exports.listarPresupuestos = async () => {
    try {
        let presupuestos = await Presupuesto.listarPresupuestos();
        return presupuestos;
    } catch (error) {
        throw error;
    }
}

module.exports.listarDetallePresupuesto = async (id) => {
    try {
        let presupuesto = await Presupuesto.listarDetallePresupuesto(id);
        return presupuesto;
    } catch (error) {
        throw error;
    }
}

module.exports.actualizarPresupuesto = async (body,  idPresupuesto) => {     
    const { proyecto, nuevaVersion, mes, año, datos } = body;
    let nuevoPresupuesto = new Presupuesto(proyecto, nuevaVersion, mes, año, datos);
    try {
        let res = await nuevoPresupuesto.actualizarPresupuesto(idPresupuesto);
        return res;
    } catch (error) {
        throw error;
    }    
}

module.exports.eliminarPresupuesto = async (id) => {
    try {
        let res = await Presupuesto.eliminarPresupuesto(id);
        return res;
    } catch (error) {
        throw error;
    }
}

 