const router = require('express').Router()
const User = require('../model/User')
const verify = require('./verifyToken')
const { postValidation } = require('../validation') 

router.get('user/:id/posts', verify, async (req, res) => {
    const user = await User.findById(req.params.id)
    res.json(user.posts)
})

router.post('/user/:id/upload', verify, async (req, res) => {
    const { error } = postValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findById({_id: req.params.id})
    const post = {
        title: req.body.title,
        text: req.body.text
    }
    user.posts.save()

})

module.exports = router