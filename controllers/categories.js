let router = require('express').Router()
let db = require('../models')

//middleware to confirm user logged in
let isLoggedIn = require('../middleware/isLoggedIn')

router.get('/test', (req, res) => {


    console.log('🟡🟡🟡🟡🟡' + req.user.id)

    db.recipe.findByPk(1)
    .then(recipe => {
        
        res.send(recipe.user_savedrecipe)
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


// GET /categories - show all categories
router.get('/', (req, res) => {

    db.category.findAll({
        //where userID = currentuser.id
        //PLACEHOLDER/TESTING
        where: {userId: req.user.id}
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