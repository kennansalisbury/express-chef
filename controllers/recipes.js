let axios = require('axios')
let router = require('express').Router()
let db = require('../models')

//middleware to confirm user logged in
let isLoggedIn = require('../middleware/isLoggedIn')


// GET /recipes/search - 1st page user sees when logged in, search recipes (api)
router.get('/search', (req, res) => {
    res.render('recipes/search/main.ejs')
})

// GET/recipes/search/results - results of search

router.get('/search/results', (req, res) => {
    let q = req.query.search
    
    axios.get(`https://api.edamam.com/search?q=${q}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
    .then(response => {
        // res.send(response.data.hits)
        res.render('recipes/search/index.ejs', {recipes: response.data.hits})
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})

router.get('/test', (req, res) => {
    console.log(req.query.url)

    let r = req.query.url
    
    axios.get(`https://api.edamam.com/search?r=${r}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
    .then(response => {
        res.send(response.data.hits)
        // res.render('recipes/search/show.ejs', {recipes: response.data.hits})
        // edamamRecipe = response.data.hits
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})

// GET /recipes/search/:id - show 1 selected search result from API
router.get('/search/:name', (req, res) => {
    res.send('show 1 recipe from search')

    // let edamamRecipe

    //call edamam on recipe id, pass data through res.render
    // axios.get(`https://api.edamam.com/search?r=http://www.edamam.com/ontologies/edamam.owl#recipe_8275bb28647abcedef0baaf2dcf34f8b&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
    // .then(response => {
    //     res.send(response.data.hits)
    //     // res.render('recipes/search/show.ejs', {recipes: response.data.hits})
    //     // edamamRecipe = response.data.hits
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.render('error')
    // })
    
    // //call spoonacular for instructions, pass through to res.render
    // console.log(req.query.url)
    // console.log(`https://api.spoonacular.com/recipes/extract?url=${req.query.url}&apiKey=${process.env.SPOON_API_KEY}`)
    // // res.render('recipes/search/show.ejs')
})

//POST /recipes - save a recipe to db
router.post('/', (req, res) => {
    //take req.body.source and pass through spoonacular, then extract & save instructions as instructions
    
    res.send('POST route for saving recipes')
})

//GET /recipes - show all saved recipes
router.get('/', (req, res) => {

    db.recipe.findAll()
    .then(recipes => {
        res.render('recipes/index.ejs', {recipes})
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})


//GET /recipes/:id/save - form for saving recipe
router.get('/save/:id', (req, res) => {

    res.send('save recipe form')
    // req.body.
    
    //     console.log(`https://api.spoonacular.com/recipes/extract?url=${recipe.url}&apiKey=${process.env.SPOON_API_KEY}`)
    //     // axios.get(`https://api.spoonacular.com/recipes/extract?url=${recipe.url}&apiKey=${process.env.SPOON_API_KEY}`)
    //     // .then(response => {
    //     //     // let instructions = response.data
    //     //     res.send(recipe)
    //     //     // res.render('recipes/save.ejs', {recipe: recipe, categories: recipe.categories})
    //     // })
    //     // .catch(err => {
    //     //     console.log(err)
    //     // })
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.render('error')
    // })

})

// GET /recipes/:id - show 1 saved recipe
router.get('/:id', (req, res) => {
    db.recipe.findByPk(req.params.id)
    .then(recipe => {
        res.render('recipes/show.ejs', {recipe})
    })
})


module.exports = router