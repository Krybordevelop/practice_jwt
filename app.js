require('dotenv').config();
require('./config/database').connect();
const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express')
const User = require('./model/user')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
const auth = require('./middleware/auth')
app.post('/reg', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) {
            res.status(400).json({ message: "all input is required" })
        }

        const oldUser = await User.findOne({ email })

        if (oldUser) {
            res.status(409).json({ message: "User already exist" })
        }

        encryptedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
        })

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: '2h'
            }
        );

        user.token = token;

        res.status(201).json(user)
    } catch (err) {
        console.log(err)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            res.status(400).json({ message: "please type valid e-mail" })
        } else if (!password) {
            res.status(400).json({ message: "password is requred" })
        }
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            );

            user.token = token;

            res.status(200).json(user)
        }
        res.status(400).json({ 'message': 'invaild credentials' })
    } catch (err) {
        console.log(err)
    }
})

app.post("/reg", async (req,res) =>{
    const {firstName, lastName, email, password} = req.body
    if (!(firstName && email && password)){
       return res.send("some field is requred")
    }
    try{
        const newUser = new User({firstName, lastName, email,password})
        const user = await newUser.save()
        return res.send(user)
    }catch(err){
        res.status(500).json({"message":"server error"} )
    }
})

app.post('/welcome', auth, (req, res) => {
    console.log(req.header)
    res.status(200).send('Welcome!')
})


module.exports = app;