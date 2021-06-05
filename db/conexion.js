
const Sequelize = require('sequelize')


const sequelize = new Sequelize('presupuestos', null, null, {
    dialect: 'mssql',
    server: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      authentication: {
        type: 'default',
        options: {
          userName: process.env.DB_USER,
          password: process.env.DB_PASS
        }
      },
    }
  })
  

module.exports = sequelize;