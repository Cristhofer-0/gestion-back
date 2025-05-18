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


const app = express()
//PARA QUE CUALQUIER PUERTO PUEDA INGRESAR
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json())
app.use(eventosRoutes)
app.use(usuariosRoutes)
app.use(ticketsRoutes)
app.use(reviewsRoutes)
app.use(ordersRoutes)
app.use(cuponesRoutes)
app.use(favoritosRoutes)
app.use(notificacionesRoutes)
app.use('/api/multimedia', multimediaRoutes); 

export default app