const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 0,
        __v: 0
    }
]

describe('Total likes', () => {
    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        expect(listHelper.totalLikes([blogs[0]])).toBe(7)
    })

    test('of a bigger list is calculated right', () => {
        expect(listHelper.totalLikes(blogs)).toBe(36)
    })
})

describe('Favorite blog', () => {
    test('from empty list', () => {
        expect(listHelper.favoriteBlog([])).toBeNull()
    })

    test('from list that has one blog to be that', () => {
        expect(listHelper.favoriteBlog([blogs[0]])).toEqual(blogs[0])
    })

    test('from a bigger list', () => {
        expect(listHelper.favoriteBlog(blogs)).toEqual(blogs[2])
    })

    test('when two have same amount of likes', () => {
        let someBlogs = [
            blogs[0],
            blogs[1],
            blogs[4]
        ]

        // Done a bit sketchy but didn't figure anything better
        let best = listHelper.favoriteBlog(someBlogs)
        expect(best === someBlogs[0] || best === someBlogs[1]).toBeTruthy()
    })
})

describe('Most Blogs', () => {
    test('from empty list', () => {
        expect(listHelper.mostBlogs([])).toBeNull()
    })

    test('from list that has one blog to be that', () => {
        const result = {
            author: 'Michael Chan',
            blogs: 1
        }

        expect(listHelper.mostBlogs([blogs[0]])).toEqual(result)
    })

    test('from a bigger list', () => {
        const result = {
            author: 'Robert C. Martin',
            blogs: 3
        }

        expect(listHelper.mostBlogs(blogs)).toEqual(result)
    })
})

describe('Most Likes', () => {
    test('from empty list', () => {
        expect(listHelper.mostLikes([])).toBeNull()
    })

    test('from list that has one blog to be that', () => {
        const result = {
            author: 'Michael Chan',
            likes: 7
        }

        expect(listHelper.mostLikes([blogs[0]])).toEqual(result)
    })

    test('from a bigger list', () => {
        const result = {
            author: 'Edsger W. Dijkstra',
            likes: 19
        }

        expect(listHelper.mostLikes(blogs)).toEqual(result)
    })
})