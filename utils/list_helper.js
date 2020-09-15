const ld = require('lodash')

const dummy = (/* blogs */) => { // No need for param 'blogs' to be defined, not used in function
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) return null

    let maxVal = blogs[0].likes
    let maxInd = 0
    blogs.forEach((blog, i) => {
        if (blog.likes > maxVal) {
            maxVal = blog.likes
            maxInd = i
        }
    })

    return blogs[maxInd]
}

const mostBlogs = blogs => {
    if (blogs.length === 0) return null

    let sorted = ld.countBy(blogs, 'author')
    let maxKey = Object.keys(sorted).reduce((max, val) => sorted[max] > sorted[val] ? max : val)
    return {
        author: maxKey,
        blogs: sorted[maxKey]
    }
}

const mostLikes = blogs => {
    if (blogs.length === 0) return null

    let sorted = ld.groupBy(blogs, 'author')
    return Object.keys(sorted).reduce((max, val) => {
        let likes = totalLikes(sorted[val])
        if (likes > max.likes) {
            return {
                author: val,
                likes: likes
            }
        }
        else {
            return max
        }
    }, { // Initial object for reduce
        author: '',
        likes: -1
    })
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}