import {Router} from 'express'
import { createEvento, deleteEvento, getEvento, getEventos, updateEvento,  getEventosByOrganizador } from '../controllers/eventos.controllers.js'

const router = Router()

router.get('/eventos', getEventos)

router.get('/eventos/:id', getEvento)

router.post('/eventos', createEvento)

router.put('/eventos/:id', updateEvento)

router.delete('/eventos/:id', deleteEvento)

router.get('/eventos/organizador/:organizadorId', getEventosByOrganizador);

export default router