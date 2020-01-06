let axios = require('axios')
let router = require('express').Router()
let isLoggedIn = require('../middleware/isLoggedIn')

//GET /profile
router.get('/', isLoggedIn, (req, res) => {
    res.render('profile/main')
})

module.exports = router