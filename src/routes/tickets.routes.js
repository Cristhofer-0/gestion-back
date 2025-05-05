import {Router} from 'express'
import { createTicket ,getTickets, getTicket, updateTicket, deleteTicket} from '../controllers/tickets.controllers.js'

const router = Router()

router.get('/tickets', getTickets)

router.get('/tickets/:id', getTicket)

router.post('/tickets', createTicket)

router.put('/tickets/:id', updateTicket)

router.delete('/tickets/:id', deleteTicket)

export default router