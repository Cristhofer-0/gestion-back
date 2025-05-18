import app from './app.js'
import  sequelize  from './config/connection.js'
import dotenv from 'dotenv';
import multimediaRoutes from './routes/multimedia.routes.js';
dotenv.config()

await sequelize.authenticate()
    .then(() => { console.log('Conexión a la base de datos establecida correctamente.'); })
    .catch(err => { console.error('No se pudo conectar a la base de datos:', err); });

app.listen(process.env.DB_PORT, () => {
    console.log(`Servidor iniciado: http://localhost:${process.env.DB_PORT}`);
});


