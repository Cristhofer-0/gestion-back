import { Router } from 'express';
import {
  createOrder,
  updateOrder,
  getOrders,
  getOrder,
  deleteOrder,
  crearOrderDelUsuario,
  verEventosSeleccionados,
  historialCompras,
  eliminarDelCarrito,
  editarCantidadOrden
} from '../controllers/orders.controllers.js';

import { verifyTokenUsuario } from '../middlewares/authUsuario.js';

const router = Router();

// Rutas públicas (sin token)
router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);
router.post('/orders', createOrder);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

// Rutas protegidas (requieren token del usuario)
router.post('/orders/crear', verifyTokenUsuario, crearOrderDelUsuario);
router.post('/orders/carrito', verifyTokenUsuario, verEventosSeleccionados);
router.delete('/orders/eliminar', verifyTokenUsuario, eliminarDelCarrito);
router.post('/orders/historial', verifyTokenUsuario, historialCompras);
router.put('/orders/editar-cantidad', verifyTokenUsuario, editarCantidadOrden);

export default router;
