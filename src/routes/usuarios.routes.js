import { Router } from 'express'
import { deleteUsuario, getUsuario, getUsuarios, updateUsuario, loginUsuario, registerUsuario, logoutUsuario, validarToken, cambiarPassword, obtenerUsuarioPorEmail, enviarEnlaceReset } from '../controllers/usuarios.controllers.js'

const router = Router()

router.get('/usuarios', getUsuarios);

router.get('/usuarios/validar', validarToken);

// ⚠️ ESTAS DOS VAN PRIMERO
router.post('/usuarios/login', loginUsuario);
router.delete('/usuarios/logout', logoutUsuario);

router.post('/usuarios/registrar', registerUsuario);

// ✅ Añade esta ruta aquí
router.post('/usuarios/enviar-enlace-reset', enviarEnlaceReset)

router.get("/usuarios/por-email/:email", obtenerUsuarioPorEmail);
router.get('/usuarios/:id', getUsuario);

router.put('/usuarios/:id', updateUsuario);
router.delete('/usuarios/:id', deleteUsuario);
router.put("/usuarios/:id/cambiar-password", cambiarPassword)



export default router