import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js'
import authRoutes from './routes/AuthRoutes.js'
import bloodRequestRoutes from './routes/requestRoutes.js'

dotenv.config()
connectDb();
const PORT = process.env.PORT || 8000

const app = express()

app.use(express.json())
app.use(cors())


app.get('/' ,(req,res)=>{
    res.send("Blood donation running successfully")
})

app.use("/api/auth", authRoutes); 
app.use("/api/bloodrequest",bloodRequestRoutes)
app.listen(PORT , ()=>{
    console.log("Server started successfully")
})