const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const name = process.env.DB_NAME || 'defaultdb'; // Nombre de la base de datos
const user = process.env.DB_USER || 'SQLEXPRESS'; // Usuario de la base de datos
const password = process.env.DB_PASSWORD || ''; // Contraseña de la base de datos

const host = process.env.DB_HOST || 'localhost'; // Host de la base de datos
const port = process.env.DB_PORT || '5432'; // Puerto de la base de datos

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
    name, // Nombre de la base de datos
    user, // Usuario de la base de datos
    password,     // Contraseña de la base de datos
    {
        host: host, // Host de la base de datos
        dialect: 'mysql', // Dialecto de la base de datos (mysql, postgres, etc.)
        logging: false, // Desactivar el logging de SQL
        port: port,      // Puerto de la base de datos

    }
);

// Probar la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida correctamente.');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
        process.exit(1); // Salir del proceso si no se puede conectar
    });

module.exports = sequelize;