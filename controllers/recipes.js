let router = require('express').Router()
let db = require('../models')

//middleware to confirm user logged in
let isLoggedIn = require('../middleware/isLoggedIn')

router.get('/search', isLoggedIn, (req, res) => {
    res.send('user home and search route')
})



module.exports = router