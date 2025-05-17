import { Router } from "express";

const router = Router()

router.post('/solicitud-evento', enviarSolicitudEvento)

export default router