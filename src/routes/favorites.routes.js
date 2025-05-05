import { Router } from "express";
import { createFavorito, deleteFavorito, getFavorito, getFavoritos, updateFavorito } from "../controllers/favorites.controllers.js";

const router = Router()

router.get('/favoritos', getFavoritos)

router.get('/favoritos/:id', getFavorito)

router.post('/favoritos', createFavorito)

router.put('/favoritos/:id', updateFavorito)

router.delete('/favoritos/:id', deleteFavorito)

export default router