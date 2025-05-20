import { Router } from 'express'
import { deleteUsuario, getUsuario, getUsuarios, updateUsuario, loginUsuario, registerUsuario, logoutUsuario, validarToken } from '../controllers/usuarios.controllers.js'

const router = Router()

router.get('/usuarios', getUsuarios);

router.get('/usuarios/validar', validarToken);

// ⚠️ ESTAS DOS VAN PRIMERO
router.post('/usuarios/login', loginUsuario);
router.delete('/usuarios/logout', logoutUsuario);

router.post('/usuarios/registrar', registerUsuario);
router.get('/usuarios/:id', getUsuario);
router.put('/usuarios/:id', updateUsuario);
router.delete('/usuarios/:id', deleteUsuario);



export default router