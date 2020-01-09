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
        
    })
})




//FOR TESTING - NEED UPDATED USER ID
const findOrCreateCategories = (categories, recipe, wasCreated, res) => {
    if(categories.length){
        async.forEach(categories, (c, done) => {
            db.category.findOrCreate({
                where: {
                    name: c.trim(),
                    userId: req.user.id}
                    // userId: 2 }
            })
            .then(([category, wasCreated]) => {
                recipe.addCategory(category)
                .then(() => {
                    done()
                })
                .catch(done)
            })
            .catch(done)
        }, 
        () => {
            //once finished adding categories, redirect to recipe
            res.redirect('/recipes/' + recipe.id +'/?wasCreated=' + wasCreated)
        })
    } else {
        res.redirect('/recipes/' + recipe.id +'/?wasCreated=' + wasCreated)
    }
}

router.get('/test', (req, res) => {
    //check for categories and create array if exist for use later in function
    let categories = ['newcat1', '3newcat', '4newcat', 'anothercategory']
  
    //check dB for recipe by sourceUrl
    db.recipe.findOne({
        where: {
            sourceUrl: 'http://www.puppy.com'
        }
    })
    .then(recipe => {
        //if recipe does not exist - create recipe, add user association and findorcreate categories
        if(!recipe) {
            db.recipe.create({
                title: 'test291832',
                source: 'test',
                sourceUrl: 'http://www.puppy.com',
                imageUrl: 'test',
                time: 1,
                servings: 1
            })
            .then(newRecipe => {
                
                //add user associations
                db.user.findByPk(2)
                .then(user => {
                    user.addRecipe(newRecipe)
                })
                .catch(err => {
                    console.log(err)
                    res.render('error')
                })
                let wasCreated = true
                //findorcreate categories
                findOrCreateCategories(categories, newRecipe, wasCreated, res)

            })
            .catch(err => {
                console.log(err)
                res.render('error')
            })
        } else {
            //else (recipe does exist) - check if associated with current user
            let wasCreated

            recipe.hasUser(2)
            .then(hasUser => {
                

                //if not associated with current user - add user associations
                if(!hasUser){
                    wasCreated = true
                    db.user.findByPk(2)
                    .then(user => {
                        user.addRecipe(recipe)
                    })
                    .catch(err => {
                        console.log(err)
                        res.render('error')
                    })
                } else {
                    wasCreated = false
                }

                //whether associated with user or not, findorcreate categories

                findOrCreateCategories(categories, recipe, wasCreated, res)

            })

        }

    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})


module.exports = router


    // findOrCreateCategories(categories, recipe)
 

   


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
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.render('error')
    // })
    
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
// })