const express= require('express')
const cors=require('cors')
require ('dotenv').config()
const  mongoose = require('mongoose')
const app=express();

const authRoutes= require('./routes/authRoute')

app.use(express.json())
app.use(cors())

//middleware
app.use('/api',authRoutes)
const URI=process.env.MONGODB_URL
mongoose.connect(URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


const PORT = process.env.PORT || 5000
 app.listen(PORT,()=>
 {
     console.log("Server  Listening")
 })