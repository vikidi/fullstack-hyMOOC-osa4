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

describe('/api/login', () => {
    describe('POST', () => {
        test('Correct login successess', async () => {
            const response = await api.post('/api/login')
                .send({ username: 'root', password: 'root_pass' })
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(response.body.token).toBeDefined()
        })

        test('Non-existing username returns 401', async () => {
            await api.post('/api/login')
                .send({ username: 'NOT_A_USERNAME', password: 'root_pass' })
                .expect(401)
                .expect('Content-Type', /application\/json/)
        })

        test('Wrong password returns 401', async () => {
            await api.post('/api/login')
                .send({ username: 'root', password: 'WRONG_PASSWORD' })
                .expect(401)
                .expect('Content-Type', /application\/json/)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})