const TestRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

TestRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = TestRouter