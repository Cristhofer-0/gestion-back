import app from './app.js'
import  sequelize  from './config/connection.js'


await sequelize.authenticate()
    .then(() => { console.log('Conexión a la base de datos establecida correctamente.'); })
    .catch(err => { console.error('No se pudo conectar a la base de datos:', err); });


app.listen(3000, () => { console.log('servidor iniciado: http://localhost:3000') })
