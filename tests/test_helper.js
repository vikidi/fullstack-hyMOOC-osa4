const Blog = require('../models/blog')
const User = require('../models/user')

// Both blogs to root
const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        user: '5f60b583568564433c2493a5',
        _id: '5f60b583568564433c2493a7'
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        user: '5f60b583568564433c2493a5',
        _id: '5f60b583568564433c2493a8'
    }
]

const initialUsers = [
    {
        username: 'root',
        name: 'Root User',
        passwordHash: '$2y$10$wEGfq4NRkwlG0R6pzkugo..UrCH4GoaThtUEIiH1nV00W0ZPR5zgm', // 'root_pass'
        blogs: ['5f60b583568564433c2493a7', '5f60b583568564433c2493a8'],
        _id: '5f60b583568564433c2493a5'
    },
    {
        username: 'basic',
        name: 'Basic User',
        passwordHash: '$2y$10$LIFf1wHKArWEQq6uvgMQzOOBq3Y52ExmdlKampNwijnzah7HTCjUy', // 'basic_pass'
        blogs: [],
        _id: '5f60b583568564433c2493a6'
    }
]

const nonExistingId = async () => {
    let blog = new Blog({
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
    })

    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const nonExistingBlog = async () => {
    let blog = new Blog({
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
    })

    await blog.save()
    await blog.remove()

    blog = blog.toJSON()
    delete blog.id

    return blog
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const rootUserID = async () => {
    const users = await usersInDb()
    return users.filter(u => u.username === 'root')[0].id.toString()
}

module.exports = {
    initialBlogs,
    initialUsers,
    nonExistingId,
    nonExistingBlog,
    blogsInDb,
    usersInDb,
    rootUserID
}