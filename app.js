const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

//Import Routes
const authRoute = require('./routes/auth')

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log("DB connected")
)
    
//Middleware
app.use(express.json())

//Route Middleware
app.use('/user', authRoute)

//Port
const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log("Connected...")
})