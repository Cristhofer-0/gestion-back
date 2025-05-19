import { Router } from 'express'
import { createPaymentIntent } from '../controllers/payment.controllers.js'
import { createSession } from '../controllers/payment.controllers.js'

const router = Router()

router.post('/payments/create-payment-intent', createPaymentIntent)


router.get("/create-checkout-session", createSession);
router.get("/success", (req, res) => res.send("succes"));
router.get("/cancel", (req, res) => res.send("cancel"));


export default router
