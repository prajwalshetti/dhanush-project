import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDb from './config/db.js'
import authRoutes from './routes/AuthRoutes.js'
import bloodRequestRoutes from './routes/requestRoutes.js'
import donationRoutes from './routes/donationRoutes.js'

dotenv.config()
connectDb()
const PORT = process.env.PORT || 8000

const app = express()

app.use(express.json())
app.use(cookieParser())

// CORS configuration: allow credentials and set the frontend origin.
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.get('/', (req, res) => {
  res.send("Blood donation running successfully")
})

app.use("/api/auth", authRoutes)
app.use("/api/bloodrequest", bloodRequestRoutes)
app.use("/api/donations", donationRoutes)

app.listen(PORT, () => {
  console.log("Server started successfully")
})
