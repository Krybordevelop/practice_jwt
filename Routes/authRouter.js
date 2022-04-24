const { Router } = require('express')
const router = Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const { userSchema ,userRoleSchema} = require("../model/user")
const jwt = require('jsonwebtoken')

router.post("/singup",
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

            const oldUser = await userSchema.findOne({ email })

            if (oldUser) {
                return res.status(200).json({ message: "User already exist" })
            }

            encryptedPassword = await bcrypt.hash(password, 7)

            const role = await userRoleSchema.findOne({value:"guest"})
            console.log(role)
            const user = await userSchema.create({
                first_name,
                last_name,
                email: email.toLowerCase(),
                password: encryptedPassword,
                role:[role.value]
            })

            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '8h'
                }
            );

            user.token = token;

            return res.status(200).json(user)
        } catch (err) {
            console.log(err)
            return res.status(500).json({ "message": "server error" })
        }
    }
)


router.post('/singin',
    body('email').isEmail().notEmpty(),
    body('password').isLength({ min: 5 }).notEmpty(),

    async (req, res) => {
        try {
            const { email, password } = req.body;

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await userSchema.findOne({ email });
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