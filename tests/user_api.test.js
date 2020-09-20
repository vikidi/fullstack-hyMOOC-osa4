const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe('/api/users', () => {
    describe('GET', () => {
        test('Users are returned as json', async () => {
            await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('User objects contain id field, not _id', async () => {
            const response = await api.get('/api/users')

            // Test for all returned blogs, testing one might be enough
            for (let user of response.body) {
                expect(user.id).toBeDefined()
                expect(user._id).not.toBeDefined()
            }
        })

        test('All users are returned', async () => {
            const response = await api.get('/api/users')
            expect(response.body).toHaveLength(helper.initialUsers.length)
        })

        test('Specific user is within the returned users', async () => {
            const response = await api.get('/api/users')

            const usernames = response.body.map(r => r.username)
            expect(usernames).toContain('basic')
        })
    })

    describe('POST', () => {
        test('Correct user can be created', async () => {
            await api
                .post('/api/users')
                .send({ username: 'NEW_USER', password: 'NEW_PASSWORD' })

            const users = await helper.usersInDb()

            expect(users.length).toBe(helper.initialUsers.length + 1)
            expect(users.map(u => u.username)).toContain('NEW_USER')
        })

        test('Correctly created user is returned as JSON', async () => {
            const response = await api
                .post('/api/users')
                .send({ username: 'NEW_USER', password: 'NEW_PASSWORD' })
                .expect(201)
                .expect('Content-Type', /application\/json/)

            expect(response.body.username).toBeDefined()
            expect(response.body.username).toBe('NEW_USER')
        })

        test('Must contain username', async () => {
            await api
                .post('/api/users')
                .send({ password: 'NEW_PASSWORD' })
                .expect(400)

            const users = await helper.usersInDb()
            expect(users.length).toBe(helper.initialUsers.length)
        })

        test('Username must be unique', async () => {
            const usersAtBeginning = await helper.usersInDb()

            await api
                .post('/api/users')
                .send({ username: usersAtBeginning[0].username, password: 'SOME_PASSWORD' })
                .expect(400)

            const users = await helper.usersInDb()
            expect(users.length).toBe(usersAtBeginning.length)
        })

        test('Must contain password', async () => {
            await api
                .post('/api/users')
                .send({ username: 'NEW_USERNAME' })
                .expect(400)

            const users = await helper.usersInDb()
            expect(users.length).toBe(helper.initialUsers.length)
        })

        test('Password can not be under 3 chars long', async () => {
            await api
                .post('/api/users')
                .send({ username: 'NEW_USERNAME', password: 'NO' })
                .expect(400)

            const users = await helper.usersInDb()
            expect(users.length).toBe(helper.initialUsers.length)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})
