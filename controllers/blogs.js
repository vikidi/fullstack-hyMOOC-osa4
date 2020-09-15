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

blogRouter.put('/:id', async (req, res) => {
    const blog = req.body

    const response = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })

    if (!response) {
        return res.status(404).end()
    }

    return res.json(response)
})

module.exports = blogRouter