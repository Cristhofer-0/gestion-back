import { Router } from 'express'
import { createSessionFromPendingOrders, ordenPagada } from '../controllers/payment.controllers.js'
import { createSession } from '../controllers/payment.controllers.js'

const router = Router()



router.get("/create-checkout-session", createSession);
router.post("/createSessionFromPendingOrders", createSessionFromPendingOrders)

router.get("/success", ordenPagada);
router.get("/cancel", (req, res) => {
    res.redirect('http://localhost:3001/carrito?status=cancelled');
});




export default router
