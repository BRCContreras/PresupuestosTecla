const usersServices = require('../controller/controller.login')
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
   

   
}
