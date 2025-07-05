import app from './app.js';
import sequelize from './config/connection.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

// Crear el servidor HTTP manualmente
const server = http.createServer(app);

// Configurar Socket.IO con CORS
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3002', 'https://sistemajoinwithus.netlify.app', 'https://joinwithusoficial.netlify.app', 'https://gestion-front.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Guardar `io` en global para usarlo en controladores
global.io = io;

// Eventos de conexión de WebSocket
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado por WebSocket');

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado del WebSocket');
  });
});

// Conectar a la base de datos
await sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');

    // Iniciar el servidor
    const PORT = process.env.DB_PORT || 3000;
    server.listen(PORT, () => {
      console.log(`✅ Servidor iniciado: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
