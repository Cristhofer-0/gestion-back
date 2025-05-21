import {Router} from 'express'
import {createOrder, updateOrder, getOrders, getOrder, deleteOrder, crearOrderDelUsuario, verEventosSeleccionados} from '../controllers/orders.controllers.js'

const router = Router()

router.get('/orders', getOrders)

router.get('/orders/:id', getOrder)

router.post('/orders/pendientes', verEventosSeleccionados)

router.post('/orders', createOrder)

router.post('/orders/crear', crearOrderDelUsuario)

router.put('/orders/:id', updateOrder)

router.delete('/orders/:id', deleteOrder)

export default router