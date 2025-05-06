import {Router} from 'express'
import { createUsuario, deleteUsuario, getUsuario, getUsuarios, updateUsuario, loginUsuario} from '../controllers/usuarios.controllers.js'

const router = Router()

router.get('/usuarios', getUsuarios)

router.get('/usuarios/:id', getUsuario)

router.post('/usuarios', createUsuario)

router.put('/usuarios/:id', updateUsuario)

router.delete('/usuarios/:id', deleteUsuario)

router.post('/usuarios/login', loginUsuario)

export default router