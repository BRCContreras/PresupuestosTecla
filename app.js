
const express = require('express')
const app = express()
require('dotenv').config()
const sequelize = require('./db/conexion')
const userRoutes = require('./view/rutas')
const midd = require('./midd/midd');
const cors = require('cors');
const Usuarios = require('./db/usuario');
const Presupuesto = require('./db/presupuesto');
const FlujoDeEfectivo = require('./db/flujo.de.efectivo');
const Ingreso = require('./db/ingreso');
const IngresoValor = require('./db/ingreso.valor');
const CostoDirecto = require('./db/costo.directo');
const CostoDirectoValor = require('./db/costo.directo.valor');
const CostoAdministrativo = require('./db/costo.administrativo');
const CostoAdministrativoValor = require('./db/costo.administrativo.valor');
const Recurso = require('./db/recurso');
const RecursoPorcentaje = require('./db/recurso.porcentaje');


//const serviciosMercadoLibre = require("./services/services");
//const swaggerUi = require('swagger-ui-express')
//const swaggerFile = require('./swagger_output.json')
//const vistaProductos = require('./mvc/vista/vista.producto')


//middleware globales
app.use(express.json());
app.use(midd.limiter);
app.use(cors());
//app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//configuraciones globales
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');




//iniciar bd
//iniciar servidor
async function inicioServidor(){
  try{
      await Usuarios.sync({alter:true})
      await Presupuesto.sync({alter: true});  
      await FlujoDeEfectivo.sync({alter: true});
      await Ingreso.sync({alter: true}); 
      await IngresoValor.sync({alter: true}); 
      await CostoDirecto.sync({alter: true}); 
      await CostoDirectoValor.sync({alter: true}); 
      await CostoAdministrativo.sync({alter: true}); 
      await CostoAdministrativoValor.sync({alter: true}); 
      await Recurso.sync({alter: true}); 
      await RecursoPorcentaje.sync({alter: true});
      await sequelize.authenticate();
      
      //await Usuarios.newUsuario({nombre:'Brandon', apellidos: 'Contreras', email: 'braru@gmail.com',movil: '4652313413', telefono: '5642156023',ciudad:'Mexico',estado:'Mexico', cp:'56460',  contrasena: '123' , usuario: 'braru@gmail.com', fechaAlta:'2022', idEstatus: 2})
      //await Usuarios.newUsuario({nombre:'Ari', apellidos: 'Olguin', email: 'admin@gmail.com',bandera_admin:'1',  contrasena: '123', fechaAlta:'2022', idEstatus: 1})
      //await Usuarios.newUsuario({nombre:'Brandon', apellidos: 'Contreras', email: 'braru@gmail.com',movil: '4652313413', telefono: '5642156023',ciudad:'Mexico',estado:'Mexico', cp:'56460',  contrasena: '123' , usuario: 'braru55', fechaAlta:'2022', idEstatus: 1})

      console.log('Conexión correcta con la db');
      app.listen(process.env.PORT,function(){
          console.log(`Servidor iniciado en ${process.env.PORT}`)
      })
  }catch(err){
      console.log(err)
      console.log('no se pudo conectar con la bd ');
  }
}
inicioServidor();

//Routes
userRoutes(app);




