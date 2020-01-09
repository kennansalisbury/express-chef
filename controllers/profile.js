let router = require('express').Router()
let isLoggedIn = require('../middleware/isLoggedIn')
let cloudinary = require('cloudinary')

//GET /profile
router.get('/', isLoggedIn, (req, res) => {
    res.render('profile/main')
})

router.get('/home', isLoggedIn, (req, res) => {
    res.render('profile/home')
})

module.exports = router