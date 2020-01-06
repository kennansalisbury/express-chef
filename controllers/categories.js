let router = require('express').Router()
let db = require('../models')

//middleware to confirm user logged in
let isLoggedIn = require('../middleware/isLoggedIn')

// GET /categories - show all categories
router.get('/', isLoggedIn, (req, res) => {
    res.send('show all categories')
})

// GET /categories/:id - show all recipes in 1 category
router.get('/:id', isLoggedIn, (req, res) => {
    res.send('show all recipes in 1 category')
})


module.exports = router