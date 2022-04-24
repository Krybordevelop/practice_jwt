//Not in Prodaction!!!

const { Router } = require("express");
const { userRoleSchema } = require('../model/user.js')
const router = Router()


//add pool of role
router.get('/add_role', async (req, res) => {
    userRoleSchema.insertMany([
        {
            value: "guest"
        },
        {
            value: "user"
        },
        {
            value: "moder"
        },
        {
            value: "admin"
        }])

res.status(200).json({ 'message': 'role' })
})

module.exports = router