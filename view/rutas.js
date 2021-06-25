const usersServices = require('../controller/controller.login')
const presupuestosServices = require('../controller/controller.presupuesto')
const middJsonAuth = require ('../midd/midd.jsonAuth')


module.exports = (app) => {
   

    app.get('/login', async (req,res)=>{
        try{
            res.render('login');
        }catch(err){
            console.log(err);
            res.status(400).json('No se puede mostrar');
        }

    })
    app.post('/login',middJsonAuth.chkLogin, async (req,res)=>{
        
        let usuario = req.body
        try {
            let resultado = await usersServices.verificarUsuario(usuario)
            if (resultado){
                let usuarioInfo = await usersServices.datosUsuario(usuario)
                let tokenResult = await usersServices.generaToken(usuario)
                res.json({token: tokenResult, user: usuarioInfo})
            }else {
                throw new Error (err)
            }
        }catch (err){
            console.log(err)
            res.status(400).json('Usuario o contrasena incorrecta')
        }
    })

    app.get('/login/index', async (req,res)=>{
        try{
            res.render('login');
        }catch(err){
            console.log(err);
            res.status(400).json('No se puede mostrar');
        }

    })

    app.get('/registro', async (req,res)=>{
        try{
            res.render('addUser');
        }catch(err){
            console.log(err);
            res.status(400).json('No se puede mostrar');
        }

    })

    app.post('/add',middJsonAuth.chkRegistro, async (req, res)=>{
        let usuarioNuevo = req.body
        try {
            let resultado = await usersServices.crearUsuario(usuarioNuevo)
            res.status(200).json('usuario creado correctamente')
        }catch (err){
            console.log(err)
            res.status(400).json('algo raro paso')
        }
    })

    app.get('/index', async (req,res)=>{
        try{
            
            res.render('index');
        }catch (err){
            console.log(err)
            res.estatus(400).json('No se puede mostrar')
        }
    })

    app.get('/index/presupuesto', async (req,res)=>{
        try{
            
            res.render('newPresupuesto');
        }catch (err){
            console.log(err)
            res.estatus(400).json('No se puede mostrar')
        }
    })
   //Presupuesto
    app.post('/presupuesto/registrar', middJsonAuth.verificarUsuario, async (req, res) => {
        let body = req.body;    
        try {
            const token = req.headers.authorization.split(' ')[1];            
            const decoded = middJsonAuth.decodificarToken(token);
            if(decoded) {
                let resultado = await presupuestosServices.registrarPresupuesto(body, decoded.data.id);
                res.status(200).json(resultado);
            }
            else
                throw new Error('Hubo un error al registar presupuesto (usuario)')
        } catch (error) {
            res.status(400).send({error: error.message});
        }
    })
    
    app.get('/presupuesto/lista', middJsonAuth.verificarUsuario, async (req, res) => {    
        try {
            let resultado = await presupuestosServices.listarPresupuestos();
            res.status(200).json(resultado);    
        } catch (error) {
            res.status(400).send({error: error.message});
        }
    })
    
    app.get('/presupuesto/:id', middJsonAuth.verificarUsuario, async (req, res) => {    
        try {
            let id = req.params.id;
            let resultado = await presupuestosServices.listarDetallePresupuesto(id);
            res.status(200).json(resultado);    
        } catch (error) {
            res.status(400).send({error: error.message});
        }
    })
    
    app.post('/presupuesto/actualizar/:id', middJsonAuth.verificarUsuario, async (req, res) => {
        let body = req.body;    
        try {
            let resultado = await presupuestosServices.actualizarPresupuesto(body,req.params.id);
            res.status(200).json(resultado);        
        } catch (error) {
            res.status(400).send({error: error.message});
        }
    })
    
    app.get('/presupuesto/eliminar/:id', middJsonAuth.verificarUsuario, async (req, res) => {    
        try {
            let id = req.params.id;
            let resultado = await presupuestosServices.eliminarPresupuesto(id);
            res.status(200).json(resultado);    
        } catch (error) {
            res.status(400).send({error: error.message});
        }
    })

   
}
