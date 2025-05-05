import { Router } from "express";
import { createCupon, deleteCupon, getCupon, getCupones, updateCupon } from "../controllers/coupons.controllers.js";

const router = Router()

router.get('/cupones', getCupones)

router.get('/cupones/:id', getCupon)

router.post('/cupones', createCupon)

router.put('/cupones/:id', updateCupon)

router.delete('/cupones/:id', deleteCupon)

export default router