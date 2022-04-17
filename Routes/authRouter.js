const { Router } = require('express')
const router = Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs/dist/bcrypt');
const User = require("../model/user")
const jwt = require('jsonwebtoken')

router.post("/singin",
    async (req, res) => {
        body('first_name').notEmpty(),
            body('email').isEmail().notEmpty(),
            body('password').isLength({ min: 5 }).notEmpty(),
            async (req, res) => {
                try {
                    const { first_name, last_name, email, password } = req.body;
                    const errors = validationResult(req)

                    if (!errors.isEmpty()) {
                        return res.status(400).json({ errors: errors.array() });
                    }

                    const oldUser = await User.findOne({ email })

                    if (oldUser) {
                        return res.status(409).json({ message: "User already exist" })
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
                            expiresIn: '8h'
                        }
                    );

                    user.token = token;

                    return res.status(201).json(user)
                } catch (err) {
                    console.log(err)
                    return res.status(500).json({ "message": "server error" })
                }
            }
    }
)


router.post('/singup',
    body('email').isEmail().notEmpty(),
    body('password').isLength({ min: 5 }).notEmpty(),

    async (req, res) => {
        try {
            const { email, password } = req.body;

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
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
                return res.status(200).json(token)
            }
            return res.status(400).json({ 'message': 'invaild credentials' })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ 'message': 'server error' })
        }
    }
)

router.get('/singout', (req, res) => {

})


module.exports = router