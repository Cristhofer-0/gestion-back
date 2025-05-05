import express from 'express'
import eventosRoutes from './routes/eventos.routes.js'

const app = express()
app.use(express.json());
app.use(eventosRoutes)

export default app