// routes/validationDNI.route.js
import { Router } from 'express';
import { verificarDNI } from '../controllers/validation.controller.js';

const router = Router();

router.post('/verificar-dni', verificarDNI);

export default router;
