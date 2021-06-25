const Presupuesto = require("../db/presupuesto");
const FlujoDeEfectivo = require("../db/flujo.de.efectivo");
const Ingreso = require("../db/ingreso");
const IngresoValor = require("../db/ingreso.valor");
const CostoDirecto = require("../db/costo.directo");
const CostoDirectoValor = require("../db/costo.directo.valor");
const CostoAdministrativo = require("../db/costo.administrativo");
const CostoAdministrativoValor = require("../db/costo.administrativo.valor");
const Recurso = require("../db/recurso");
const RecursoPorcentaje = require("../db/recurso.porcentaje");
const Usuario = require("../db/usuario");

module.exports = class PresupuestoModel {
    constructor(proyecto, nuevaVersion, mes, año, datos) { 
        this.proyecto = proyecto;
        this.nuevaVersion = nuevaVersion;
        this.mes = mes;
        this.año = año;
        this.datos = datos;        
    }   
static listarPresupuestos = async () => {
    try {
        let presupuestos = await Presupuesto.findAll({
            where: {
                eliminado: false
            },
            order: [
                ['updatedAt', 'DESC']
            ],
            attributes: ['id', 'proyecto', 'version', 'año', 'mes', 'createdAt', 'updatedAt'],
            include: {
                model: Usuario,                    
                attributes: ['id', 'email', 'nombres', 'apellidos']
            }
        }) 
        return presupuestos;
    } catch (error) {
        console.log(error.message);
        throw new Error('Error en la consulta de presupuestos')
    }
}

registrarPresupuesto = async (idUsuario) => {
    try {
        let presupuesto = await Presupuesto.create({
            proyecto: this.proyecto,
            version: 1,
            mes: this.mes,
            año: this.año,
            eliminado: false, 
            id_usuario: idUsuario
        });
        await this.insertarValoresPresupuesto(presupuesto.id);
        return 'Presupuesto creado';
    } catch (error) {
        throw new Error('Error al crear presupuesto');
    }
}

static listarDetallePresupuesto = async (id) => {
        try {
            let presupuesto = await Presupuesto.findOne({
                where: {
                    id: id,
                    eliminado: false
                },
                attributes: ['id', 'proyecto', 'version', 'año', 'mes', 'createdAt', 'updatedAt', 'id_usuario', 'eliminado'],
                include: [                                                         
                    {
                        model: FlujoDeEfectivo, 
                        attributes: ['id', 'ingreso'],                        
                    },
                    {
                        model: Ingreso,
                        attributes: ['id', 'concepto'],
                        include: {
                            model: IngresoValor,
                            attributes: ['id', 'valor']
                        }
                    },
                    {
                        model: CostoDirecto,
                        attributes: ['id', 'concepto', 'opcion'],
                        include: {
                            model: CostoDirectoValor,
                            attributes: ['id', 'valor']
                        }
                    },
                    {
                        model: CostoAdministrativo,
                        attributes: ['id', 'concepto', 'opcion'],
                        include: {
                            model: CostoAdministrativoValor,
                            attributes: ['id', 'valor']
                        }
                    },
                    {
                        model: Recurso,
                        attributes: ['id', 'concepto', 'costo_mensual'],
                        include: {
                            model: RecursoPorcentaje,
                            attributes: ['id', 'porcentaje']
                        }
                    }
                ] 
                
            });           
            if (!presupuesto)
                throw new Error('Presupuesto no encontrado');
            
            return presupuesto;

        } catch (error) {
            throw error;
        }
    }    
   
actualizarPresupuesto = async (id) => {
        try {
            let presupuestoAModificar = await Presupuesto.findOne({
                where: {
                    id: id,
                    eliminado: false
                }
            });

            if (!presupuestoAModificar)
                throw new Error('Presupuesto no encontrado');
            
            presupuestoAModificar.proyecto = this.proyecto;
            presupuestoAModificar.mes = this.mes;
            presupuestoAModificar.año = this.año;
            
            if(this.nuevaVersion) 
                presupuestoAModificar.version++;
                
            presupuestoAModificar.save();            
                
            FlujoDeEfectivo.destroy({
                where: { id_presupuesto: id }
            });
            Ingreso.destroy({
                where: { id_presupuesto: id }
            });
            CostoDirecto.destroy({
                where: { id_presupuesto: id }
            });
            CostoAdministrativo.destroy({
                where: { id_presupuesto: id }
            });
            Recurso.destroy({
                where: { id_presupuesto: id }
            });                        
            await this.insertarValoresPresupuesto(id);

            return 'Presupuesto modificado';
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear presupuesto');
        }
    }

    
static eliminarPresupuesto = async (id) => {
        try {
            let presupuestoAEliminar = await Presupuesto.findOne({
                where: {
                    id: id,
                    eliminado: false
                }
            });

            if (!presupuestoAEliminar)
                throw new Error('Presupuesto no encontrado');

            presupuestoAEliminar.eliminado = true;
            presupuestoAEliminar.save();            
                
            return 'Presupuesto eliminado';
        } catch (error) {
            throw error;
        }        
    }

static eliminarPresupuestoBD = async (id) => {
        try {
            await Presupuesto.destroy({
                where: {
                    id: id,
                    eliminado: true
                }
            });
            return 'Presupuesto eliminado definitivamente';
        } catch (error) {
            throw new Error('Error al eliminar presupuesto de la base de datos');
        }        
    }

insertarValoresPresupuesto = async (idPresupuesto) => {
        try {
            
            this.datos.flujoDeEfectivo.forEach(async ingresoFE => {
                await FlujoDeEfectivo.create({
                    ingreso: ingresoFE,
                    id_presupuesto: idPresupuesto
                });
            });
            
            this.datos.ingresos.forEach(async ingreso => {
                let nuevoIngreso = await Ingreso.create({
                    concepto: ingreso.concepto,
                    id_presupuesto: idPresupuesto
                });
                ingreso.valores.forEach(async valor => {
                    await IngresoValor.create({
                        valor: valor,
                        id_ingreso: nuevoIngreso.id
                    });
                });
            });
            
            this.datos.costosDirectos.forEach(async costoDirecto => {
                let nuevoCostoDirecto = await CostoDirecto.create({
                    concepto: costoDirecto.concepto,
                    opcion: costoDirecto.opcion,
                    id_presupuesto: idPresupuesto
                });
                costoDirecto.valores.forEach(async valor => {
                    await CostoDirectoValor.create({
                        valor: valor,
                        id_costo_directo: nuevoCostoDirecto.id
                    });
                });
            });
            
            this.datos.costosAdministrativos.forEach(async costoAdministrativo => {
                let nuevoCostoAdministrativo = await CostoAdministrativo.create({
                    concepto: costoAdministrativo.concepto,
                    opcion: costoAdministrativo.opcion,
                    id_presupuesto: idPresupuesto
                });
                costoAdministrativo.valores.forEach(async valor => {
                    await CostoAdministrativoValor.create({
                        valor: valor,
                        id_costo_administrativo: nuevoCostoAdministrativo.id
                    });
                });
            });            
            
            this.datos.recursos.forEach(async recurso => {
                let nuevoRecurso = await Recurso.create({
                    concepto: recurso.concepto,
                    costo_mensual: recurso.costoMensual,
                    id_presupuesto: idPresupuesto
                });
                recurso.porcentajes.forEach(async porcentaje => {
                    await RecursoPorcentaje.create({
                        porcentaje: porcentaje,
                        id_recurso: nuevoRecurso.id
                    });
                });
            });
        } catch (error) {
            throw new Error('Error al insertar valores de presupuesto')
        }
        
    }
}