const router = require('express').Router()
const brcypt = require('bcrypt')
const User = require('../models/User')

//register
router.post("/register",async(req,res)=>{
    try {
        const salt = await brcypt.genSalt(10)
        const hashedPassword = await brcypt.hash(req.body.password,salt)

        const newUser = new User({
            username : req.body.username,
            email: req.body.email,
            password:hashedPassword
        })

        const user = await newUser.save();
        res.status(200).json(user._id)

    } catch (err) {
        res.status(500).json(err)
    }
})
//login

router.post("/login",async (req,res)=>{
    try {
        const user = await User.findOne({username:req.body.username})
        !user && res.status(400).json("Invalid Username or Password!")

        const validPassword = await brcypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("Invalid Username or Password!")

        res.status(200).json({id:user._id,username:user.username});
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;