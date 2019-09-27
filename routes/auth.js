const router = require("express").Router()
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation') 

router.get('/', async (req, res) => {
    res.send("User page")
})

router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const emailVerify = await User.findOne({ email: req.body.email })
    if (emailVerify) return res.status(400).send("Email already exists")
    
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    })
    
    try{
        const savedUser = await user.save()
        const token = await jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.header('auth-token', token).send(savedUser)
        // res.send(savedUser)
    }catch(err) {
        res.status(400).send(err)
    }
})

router.post('/login', async(req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid Email/Password")

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("Invalid Email/Password")

    const token = await jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

})

module.exports = router