//import sql from 'mssql'
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config()

 const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mssql',
        dialectOptions: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
        },
        logging: false,
    }
)

export default sequelize;