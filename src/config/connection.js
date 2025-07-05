//import sql from 'mssql'
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config()

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,     // "railway"
  process.env.MYSQLUSER,         // "root"
  process.env.MYSQLPASSWORD,     // tu password
  {
    host: process.env.MYSQLHOST, // 👈 Esto estaba mal antes
    port: process.env.MYSQLPORT, // 👈 Esto estaba mal antes
    dialect: 'mysql',
    timezone: '-05:00',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
);


export default sequelize;