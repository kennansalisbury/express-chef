let router = require('express').Router()
let db = require('../models')

//middleware to confirm user logged in
let isLoggedIn = require('../middleware/isLoggedIn')


// GET /recipes/search - 1st page user sees when logged in, search recipes (api)
router.get('/search', isLoggedIn, (req, res) => {
    res.send('user home and search route')
})

// GET /recipes/search/:id - show 1 selected search result from API
router.get('/search/:id', isLoggedIn, (req, res) => {
    res.send('show selected recipe from api search')
})

//POST /recipes - save a recipe to db
router.post('/', isLoggedIn, (req, res) => {
    res.send('POST route for saving recipes')
})

//GET /recipes/save - form for saving recipe
router.get('/save', isLoggedIn, (req, res) => {
    res.send('save recipe FORM')
})

//GET /recipes - show all saved recipes
router.get('/', isLoggedIn, (req, res) => {
    res.send('show all saved recipes')
})

// GET /recipes/:id - show 1 saved recipe
router.get('/:id', isLoggedIn, (req, res) => {
    res.send('show 1 saved recipe')
})

module.exports = router