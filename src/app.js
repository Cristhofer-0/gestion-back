import express from 'express'
import cors from 'cors'

import eventosRoutes from './routes/eventos.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import ticketsRoutes from './routes/tickets.routes.js'
import reviewsRoutes from './routes/reviews.routes.js'
import ordersRoutes from './routes/orders.routes.js'
import cuponesRoutes from './routes/coupons.routes.js'
import favoritosRoutes from './routes/favorites.routes.js'
import notificacionesRoutes from './routes/notifications.routes.js'
import multimediaRoutes from "./routes/multimedia.routes.js"
import solicitudRoutes from './routes/solicitud.routes.js'
import ayudaRoutes from './routes/ayuda.routes.js'
import paymentRoutes  from './routes/payment.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import validationDNIRoute from './routes/validation.route.js'

import cookieParser from 'cookie-parser'


const app = express()
//PARA QUE CUALQUIER PUERTO PUEDA INGRESAR
const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002', 'https://sistemajoinwithus.netlify.app', 'https://joinwithusoficial.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como en postman o curl) o si está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


app.use(express.json())

app.use(cookieParser())

app.use(eventosRoutes)
app.use(usuariosRoutes)
app.use(ticketsRoutes)
app.use(reviewsRoutes)
app.use(ordersRoutes)
app.use(cuponesRoutes)
app.use(favoritosRoutes)
app.use(notificacionesRoutes)
app.use('/api/multimedia', multimediaRoutes)
app.use(solicitudRoutes)
app.use(ayudaRoutes)
app.use(dashboardRoutes)
app.use('/api', validationDNIRoute);


app.use(paymentRoutes)

export default app