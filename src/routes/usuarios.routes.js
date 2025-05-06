import {Router} from 'express'
import { deleteUsuario, getUsuario, getUsuarios, updateUsuario, loginUsuario, registerUsuario} from '../controllers/usuarios.controllers.js'

const router = Router()

router.get('/usuarios', getUsuarios)

router.get('/usuarios/:id', getUsuario)

router.post('/usuarios/registrar', registerUsuario)

router.put('/usuarios/:id', updateUsuario)

router.delete('/usuarios/:id', deleteUsuario)

router.post('/usuarios/login', loginUsuario)

export default router