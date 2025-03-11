import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js'

dotenv.config()
connectDb();
const PORT = process.env.PORT || 8000

const app = express()

app.use(express.json())
app.use(cors())


app.get('/' ,(req,res)=>{
    res.send("Blood donation running successfully")
})

app.listen(PORT , ()=>{
    console.log("Server started successfully")
})