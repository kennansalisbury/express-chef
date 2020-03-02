let router = require('express').Router()
let isLoggedIn = require('../middleware/isLoggedIn')

//** SETUP UPDATE: update controller setup so that main route is not profile except for actual profile page

//GET /profile
router.get('/', isLoggedIn, (req, res) => {
    res.render('profile/main')
})

router.get('/home', isLoggedIn, (req, res) => {
    res.render('profile/home')
})

module.exports = router