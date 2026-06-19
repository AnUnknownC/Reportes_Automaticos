import 'dotenv/config'
import express from 'express'
import {errorHandler} from './src/middlewares/error.middleware'
import authRoutes from './src/routes/auth.routes'
import clientsRoutes from './src/routes/clients.routes.js'


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())


app.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
app.use('/api/auth', authRoutes)
app.use('/api/clients', clientsRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

