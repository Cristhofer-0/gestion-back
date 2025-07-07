import { Router } from "express";
import { createNotificacion, deleteNotificacion, getNotificacion, getNotificaciones, updateNotificacion, getNotificacionesPorUsuario, marcarNotificacionComoLeida, marcarTodasNotificacionesComoLeidas } from "../controllers/notifications.controllers.js";

const router = Router()

router.get('/notificaciones', getNotificaciones)

router.get('/notificaciones/usuario/:userId', getNotificacionesPorUsuario); 

router.get('/notificaciones/:id', getNotificacion)

router.post('/notificaciones', createNotificacion)

// ✅ CORREGIDO: Marcar una notificación como leída por ID
router.put('/notificaciones/leida/:id', marcarNotificacionComoLeida);

// Marcar todas las notificaciones de un usuario como leídas
router.put('/notificaciones/leidas/usuario/:userId', marcarTodasNotificacionesComoLeidas);

router.put('/notificaciones/:id', updateNotificacion)

router.delete('/notificaciones/:id', deleteNotificacion)

export default router