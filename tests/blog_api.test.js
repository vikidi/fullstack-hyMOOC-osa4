const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('blog objects contain id field, not _id', async () => {
        const response = await api.get('/api/blogs')

        // Test for all returned blogs, testing one might be enough
        for (let blog of response.body) {
            expect(blog.id).toBeDefined()
            expect(blog._id).not.toBeDefined()
        }
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)
        expect(titles).toContain('Canonical string reduction')
    })
})

describe('POST /api/blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = await helper.nonExistingBlog()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain(
            'First class tests'
        )
    })

    test('blog with likes not defined can be added with 0 likes', async () => {
        let newBlog = await helper.nonExistingBlog()
        delete newBlog.likes // No likes defined

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const addedBlog = blogsAtEnd.filter(blog => blog.id === response.body.id)

        expect(addedBlog[0].likes).toBe(0)
    })

    test('blog without title will not be added', async () => {
        let newBlog = await helper.nonExistingBlog()
        delete newBlog.title // No likes defined

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })

    test('blog without url will not be added', async () => {
        let newBlog = await helper.nonExistingBlog()
        delete newBlog.url // No likes defined

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
})

describe('DELETE /api/blogs/:id', () => {
    test('successfull delete with valid id', async () => {
        const blogsAtBeginning = await helper.blogsInDb()
        const id = blogsAtBeginning[0].id

        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(blogsAtBeginning.length - 1)
        expect(blogsAtEnd.filter(blog => blog.id === id).length).toBe(0)
    })

    test('id not found, returns 204', async () => {
        const blogsAtEBeginning = await helper.blogsInDb()
        const id = await helper.nonExistingId()

        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(blogsAtEBeginning.length)
    })

    test('invalid id, returns 400', async () => {
        const blogsAtEBeginning = await helper.blogsInDb()
        const id = 'INVALID_ID'

        await api
            .delete(`/api/blogs/${id}`)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(blogsAtEBeginning.length)
    })
})

describe('PUT /api/blogs/:id', () => {
    test('successfully updated with valid id', async () => {
        const blogToUpdate = (await helper.blogsInDb())[0]
        const newTitle = 'New Title'
        const id = blogToUpdate.id

        blogToUpdate.title = newTitle
        delete blogToUpdate.id

        const response = await api
            .put(`/api/blogs/${id}`)
            .send(blogToUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        expect(response.body.title).toBe(newTitle)
        expect(blogsAtEnd.filter(blog => blog.id === id)[0].title).toBe(newTitle)
    })

    test('id not found, returns 404', async () => {
        const blogsAtBeginning = await helper.blogsInDb()
        const blogToUpdate = { ...blogsAtBeginning[0] }
        const newTitle = 'New Title'

        blogToUpdate.title = newTitle
        delete blogToUpdate.id

        await api
            .put(`/api/blogs/${await helper.nonExistingId()}`)
            .send(blogToUpdate)
            .expect(404)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toEqual(blogsAtBeginning)
    })

    test('invalid id, returns 400', async () => {
        const blogsAtBeginning = await helper.blogsInDb()
        const blogToUpdate = { ...blogsAtBeginning[0] }
        const newTitle = 'New Title'

        blogToUpdate.title = newTitle
        delete blogToUpdate.id

        await api
            .put('/api/blogs/INVALID_ID')
            .send(blogToUpdate)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toEqual(blogsAtBeginning)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
