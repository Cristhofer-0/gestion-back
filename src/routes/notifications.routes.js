import { Router } from "express";
import { createNotificacion, deleteNotificacion, getNotificacion, getNotificaciones, updateNotificacion } from "../controllers/notifications.controllers.js";

const router = Router()

router.get('/notificaciones', getNotificaciones)

router.get('/notificaciones/:id', getNotificacion)

router.post('/notificaciones', createNotificacion)

router.put('/notificaciones/:id', updateNotificacion)

router.delete('/notificaciones/:id', deleteNotificacion)

export default router