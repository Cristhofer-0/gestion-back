import { Router } from "express";
import { getIngresosGenerales, getCantidadOrdenesPagadas, getPorcentajeCambioIngresos} from "../controllers/dashboard.controllers.js";

const router = Router()

router.get('/ingresitos', getIngresosGenerales);
router.get('/ordenes-pagadas', getCantidadOrdenesPagadas);
router.get('/porcentaje-cambio-ingresos', getPorcentajeCambioIngresos);

export default router