require('dotenv').config();
require('./config/database').connect();

const express = require('express')

const app = express()
app.use(express.json())
//const auth = require('./middleware/auth')
const welcomeRouter = require("./Routes/welcomeReuter")
const authRouter = require("./Routes/authRouter")
const testRouter = require('./Routes/forTest')
app.use('/', welcomeRouter)
app.use('/auth', authRouter)
app.use('/test', testRouter)

module.exports = app