// routes/validationDNI.route.js
import { Router } from 'express';
import { verificarDNI, validarTelefono, validarEmail } from '../controllers/validation.controller.js';

const router = Router();

router.post('/verificar-dni', verificarDNI);
router.post("/validar-telefono", validarTelefono);
router.post("/validar-email", validarEmail);

export default router;
