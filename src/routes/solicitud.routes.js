import { Router } from "express";
import { enviarSolicitud } from "../controllers/solicitud.controller.js";

const router = Router()

router.post('/solicitud-evento', enviarSolicitud)

export default router