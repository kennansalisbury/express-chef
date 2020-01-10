let router = require('express').Router()
let db = require('../models')
let async = require('async')
let cloudinary = require('cloudinary')


//middleware to confirm user logged in
let isLoggedIn = require('../middleware/isLoggedIn')

// GET /categories - show all categories for current user
router.get('/', isLoggedIn, (req, res) => {

    db.category.findAll({
        where: {userId: req.user.id},
        include: [db.recipe]
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
router.get('/:id', isLoggedIn, (req, res) => {

    db.category.findOne({
        where: {id: req.params.id,
                userId: req.user.id
                // userId: 2
        },
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

//PUT /categories/:id - edit category
router.put('/:id', isLoggedIn, (req, res) => {
    // res.send('PUT ROUTE')

    db.category.update({
        name: req.body.name
    },
    {
        where: {
            id: req.params.id
        } 
    })
    .then(category => {
        res.redirect('/categories/' + req.params.id)
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})


// DELETE /categories/remrec/:id - removes specified recipe/category association
router.delete('/:id/remrec', isLoggedIn, (req, res)=> {
    db.recipes_categories.destroy({
        where: {
            recipeId: req.body.id,
            categoryId: req.params.id
        }
    })
    .then(destroyed => {
        res.redirect('/categories/' + req.params.id)
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})


// DELETE /categories - delete categories
router.delete('/:id', isLoggedIn, (req, res) => {
    //delete the category from the database (check if auto deletes from recipes_categories table)
    db.category.destroy({
        where: {id: req.params.id}
    })
    .then(destroyedCategory => {
        console.log('🍣🍣🍣'+ destroyedCategory + 'category was removed 🍣🍣🍣')
        db.recipes_categories.destroy({
            where: { categoryId: req.params.id }
        })
        .then(() => {
            res.redirect('/categories')
        })
        .catch(err => {
            console.log(err)
            res.render('error')
        }) 
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})



module.exports = router
