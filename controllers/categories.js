let router = require('express').Router()
let db = require('../models')

//middleware to confirm user logged in
let isLoggedIn = require('../middleware/isLoggedIn')

//FOR TESTING
router.get('/test', (req, res) => {

    // db.recipe.findOne({
    //     where: {
    //         sourceUrl: req.body.sourceUrl,
    //     },
    //     include: [db.user, {
    //         where: {url}
    //     }],
    // })



    // db.recipe.findByPk(1)
    // .then(recipe => {
    //     // recipe.hasUser(req.user.id)
    //     recipe.hasUser(5)
    //     .then(hasUser => {
    //         res.send(hasUser)
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.render('error')
    //     })

        // db.user.findByPk(req.user.id)
        // .then(user => {
        //     user.hasRecipe(recipe)
        //     .then(recipe => {
        //         res.send(recipe)
        //     })
        //     .catch(err => {
        //         console.log(err)
        //         res.render('error')
        //     }) 
        // })
        // .catch(err => {
        //     console.log(err)
        //     res.render('error')
        // }) 
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
    
    // db.recipe.findAll({
    //     include: [{
    //         model: db.user, 
    //         where: {id: req.user.id}
    //     }],
    // })
    // .then(recipes => {
    //     res.send(recipes)
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.render('error')
    // })
})


// GET /categories - show all categories for current user
router.get('/', (req, res) => {

    db.category.findAll({
        // where: {userId: req.user.id}
        where: {userId: 5},
        include: [db.user]
    })
    .then(categories => {
        res.render('categories/index.ejs', {categories})
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})

// GET /categories/:id - show all recipes in 1 category
router.get('/:id', (req, res) => {

    db.category.findOne({
        where: {id: req.params.id},
        include: [db.recipe]
    })
    .then(category => {
        res.render('categories/show.ejs', {category: category, recipes: category.recipes})
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    }) 
})

module.exports = router