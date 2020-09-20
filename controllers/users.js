const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')

const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res) => {
    const body = req.body

    if (!body.password || body.password.length < 3) return res.status(400).send({ error: 'password is missing or it is invalid' })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({ ...body, passwordHash })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = usersRouter