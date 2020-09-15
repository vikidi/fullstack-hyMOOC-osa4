const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})

blogRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body)

    if (!blog.title || !blog.url) return res.status(400).end()

    const result = await blog.save()
    res.status(201).json(result)
})

blogRouter.delete('/:id', async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id)
    return res.status(204).end() // Same status found or not
})

module.exports = blogRouter