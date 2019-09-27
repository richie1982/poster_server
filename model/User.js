const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String
    },
    text: {
        type: String
    },
})

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    posts: [
        postSchema
    ]

})

module.exports = mongoose.model('User', userSchema)