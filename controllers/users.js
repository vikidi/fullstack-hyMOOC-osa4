const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')

const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res) => {
    const body = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({ ...body, passwordHash })

    console.log(user)

    const savedUser = await user.save()

    res.json(savedUser)
})

module.exports = usersRouter