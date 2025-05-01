// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const PORT = 3000;

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

app.use(cors({
  origin: '*', // Permitir todas las solicitudes de origen cruzado
  credentials: true, // Permitir el envío de cookies y encabezados de autorización
}));

const app = express();
app.get('/', (req, res) => {
  res.send('¡Hola mundo desde Express!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
