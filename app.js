require('dotenv').config();
require('./config/database').connect();

const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
//const auth = require('./middleware/auth')
const welcomeRouter = require("./Routes/welcomeReuter")
const authRouter = require("./Routes/authRouter")
app.use('/', welcomeRouter)
app.use('/auth', authRouter)


module.exports = app