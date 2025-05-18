// routes/multimedia.routes.js
import express from 'express';
import { uploadImage } from '../handlers/index.js';

const router = express.Router();

// Ruta para subir imágenes
router.post('/upload-image', uploadImage);

export default router;
