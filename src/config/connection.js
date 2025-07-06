//import sql from 'mssql'
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config()

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: 'mysql',
    timezone: '-05:00',
    logging: false,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
      dateStrings: true,
      typeCast(field, next) {
        if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
          return field.string();
        }
        return next();
      }
    },
  }
);


export default sequelize;