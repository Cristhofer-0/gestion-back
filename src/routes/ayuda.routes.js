import { Router } from "express";
import { enviarAyuda } from "../controllers/ayuda.controllers.js";

const router = Router()

router.post('/ayuda', enviarAyuda)

export default router