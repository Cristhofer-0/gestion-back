//import sql from 'mssql'
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config()



 const sequelize = new Sequelize(
    process.env.DB_NAME,  // Nombre de la base de datos
    process.env.DB_USER,  // Usuario
    process.env.DB_PASSWORD,  // Contraseña
    {
        host: process.env.DB_HOST,  // Host de la base de datos
        dialect: 'mssql',  // Tipo de base de datos (para SQL Server)
        dialectOptions: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
        },
        logging: false,  // Desactivar el log de las consultas (puedes activarlo si lo prefieres)
    }
);
export default sequelize; // Exportar la instancia de Sequelize para usarla en otros archivos