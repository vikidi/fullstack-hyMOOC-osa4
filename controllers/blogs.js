const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({ ...req.body, user: user._id })

    if (!blog.title || !blog.url) return res.status(400).end()

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
        return res.status(404).end()
    }

    if (blog.user.toString() === user._id.toString()) {
        await blog.remove()
        return res.status(204).end()
    }
    else {
        return res.status(401).end()
    }
})

blogRouter.put('/:id', async (req, res) => {
    const blog = req.body

    const response = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })

    if (!response) {
        return res.status(404).end()
    }

    return res.json(response)
})

module.exports = blogRouter