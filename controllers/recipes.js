let axios = require('axios')
let router = require('express').Router()
let db = require('../models')
let async = require('async')
let cloudinary = require('cloudinary')

//middleware to confirm user logged in
let isLoggedIn = require('../middleware/isLoggedIn')


// GET /recipes/search - 1st page user sees when logged in, search recipes (api)
router.get('/search', isLoggedIn, (req, res) => {
    res.render('recipes/search/main.ejs')
})

// GET/recipes/search/results - results of search
router.get('/search/results', isLoggedIn, (req, res) => {
    let q = req.query.search
    
    axios.get(`https://api.edamam.com/search?q=${q}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
    .then(response => {
        // res.send(response.data.hits)
        res.render('recipes/search/index.ejs', {recipes: response.data.hits, search: req.query.search})
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })

    // res.render('recipes/search/index.ejs', {recipes: null})
})

// GET /recipes/search/result - show 1 selected search result from API
router.get('/search/result', isLoggedIn, (req, res) => {
    let r = encodeURIComponent(req.query.url)

    console.log(`🥥🥥🥥🥥 https://api.edamam.com/search?r=${r}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)

    //get recipe data to show from edamam
    axios.get(`https://api.edamam.com/search?r=${r}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
    .then(response => {
        // console.log(response.data[0])
       
        let edamamRecipeUrl = response.data[0].url

        console.log(`🥥🥥🥥🥥 https://api.spoonacular.com/recipes/extract?url=${edamamRecipeUrl}&apiKey=${process.env.SPOON_API_KEY}`)
        
        //put recipe URL through spoonacular api to recieve instructions
        axios.get(`https://api.spoonacular.com/recipes/extract?url=${edamamRecipeUrl}&apiKey=${process.env.SPOON_API_KEY}`)
        .then(spoonData => {
            //find all existing categories to pass through
            db.category.findAll({
                    where: {userId: req.user.id}
                })
            .then(categories => {
        
                //render show page with edamam and spoonacular data and existing categories for user
                res.render('recipes/search/show.ejs', {
                    recipe: response.data[0], 
                    instructionsText: spoonData.data.instructions, 
                    instructionsObj: spoonData.data.analyzedInstructions,
                    time: spoonData.data.readyInMinutes,
                    types: spoonData.data.dishTypes,
                    categories: categories
                })

            }).catch(err => {
                console.log(err)
                res.render('error')
            })
        }).catch(err => {
            console.log(err)
            res.render('error')
        })
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })

})

// GET /recipes/add - show input URL to extract recipe
router.get('/add', isLoggedIn, (req, res) => {
    res.render('recipes/add/new')
})

// GET /recipes/add/result - show extracted recipe for confirmation before saving
router.get('/add/result', isLoggedIn, (req, res) => {
    
    axios.get(`https://api.spoonacular.com/recipes/extract?url=${req.query.url}&apiKey=${process.env.SPOON_API_KEY}`)
        .then(spoonData => {
            //find all existing categories to pass through
            db.category.findAll({
                    where: {userId: req.user.id}
                })
            .then(categories => {
                let ingredientsObj = []
                spoonData.data.extendedIngredients.forEach(ingredient => {
                    ingredientsObj.push({
                        text: ingredient.original
                    })
                })
                //render show page with edamam and spoonacular data and existing categories for user
                res.render('recipes/add/show', {
                    recipe: {
                        title: spoonData.data.title,
                        source: spoonData.data.sourceName,
                        sourceUrl: req.query.url,
                        imageUrl: spoonData.data.image,
                        time: spoonData.data.readyInMinutes,
                        servings: spoonData.data.servings ,
                        ingredientsObj: ingredientsObj,
                        instructionsText: spoonData.data.instructions, 
                        dishTypes: spoonData.data.dishTypes,
                        dietLabels: spoonData.data.diets,
                        healthLabels: spoonData.data.diets
                    },
                    categories: categories
                })
            }).catch(err => {
                console.log(err)
                res.render('error')
            })
        }).catch(err => {
            console.log(err)
            res.render('error')
        })
})

//POST /recipes - save a recipe to db
router.post('/', isLoggedIn, (req, res) => {
    let categories = []
    
    // check if there are either existing or new categories in form
    if(req.body.existing_categories){
        typeof req.body.existing_categories === 'string' ? categories = [req.body.existing_categories] : categories = req.body.existing_categories
    }

    if(req.body.new_categories){
        let newCategories = req.body.new_categories.split(',')
        categories = categories.concat(newCategories)
    }

    const findOrCreateCategories = (categories, recipe, wasCreated, req, res) => {

        if(categories.length){
            async.forEach(categories, (c, done) => {
                db.category.findOrCreate({
                    where: {
                        name: c.trim().toLowerCase(),
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


    // find or create recipe
    db.recipe.findOne({
        where: {
            sourceUrl: req.body.sourceUrl
        }
    })
    .then(recipe => {
        //if recipe does not exist - create recipe, add user association and findorcreate categories
        if(!recipe) {
            db.recipe.create({
                title: req.body.title,
                source: req.body.source,
                sourceUrl: req.body.sourceUrl,
                imageUrl: req.body.imageUrl,
                time: req.body.time,
                servings: req.body.servings,
                ingredientsText: req.body.ingredientsText,
                ingredientsObj: req.body.ingredients,
                instructionsText: req.body.instructionsText,
                instructionsObj: req.body.instructions,
                dishTypes: req.body.types,
                dietLabels: req.body.diet,
                healthLabels: req.body.health,
                calories: req.body.calories
            })
            .then(newRecipe => {
                
                //add user associations

                db.user.findByPk(req.user.id)
                // db.user.findByPk(2)
                .then(user => {
                    user.addRecipe(newRecipe)
                })
                .catch(err => {
                    console.log(err)
                    res.render('error')
                })
                let wasCreated = true
                //findorcreate categories
                findOrCreateCategories(categories, newRecipe, wasCreated, req, res)

            })
            .catch(err => {
                console.log(err)
                res.render('error')
            })
        } else {
            //else (recipe does exist) - check if associated with current user
            let wasCreated

            recipe.hasUser(req.user.id)
            // recipe.hasUser(2)
            .then(hasUser => {
                

                //if not associated with current user - add user associations
                if(!hasUser){
                    wasCreated = true

                    db.user.findByPk(req.user.id)
                    // db.user.findByPk(2)
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

                findOrCreateCategories(categories, recipe, wasCreated, req, res)

            })

        }

    }) 
    
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})

//GET /recipes - show all saved recipes
router.get('/', isLoggedIn, (req, res) => {

    db.recipe.findAll({
        include: [{
            model: db.user, 
            where: {id: req.user.id}
            // where: {id: 2}
        }],
    })
    .then(recipes => {
        res.render('recipes/index.ejs', {recipes})
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})


// GET /recipes/:id - show 1 saved recipe (ensure users cannot access other users recipes)
router.get('/:id', isLoggedIn, (req, res) => {
    let recipeWasCreated
    
    if(req.query.wasCreated) {
        recipeWasCreated = req.query.wasCreated
    }

    db.recipe.findOne({
        where: {id: req.params.id},
        include: [db.category]
    })
    .then(recipe => {
        
        //if connected to current user, show - else, show error page

        recipe.hasUser(req.user.id)
        // recipe.hasUser(2)
        .then(hasUser => {
            if(hasUser) {
                //if user associated with recipe, check each category for user and push to new array if associated with current user
                let currentUserRecipeCategories = []
                async.forEach(recipe.categories, (c, done) => {    
                    db.category.findOne({
                        where: {
                            id: c.id,
                            userId: req.user.id
                            // userId: 2
                        }
                    })
                    .then(category => {
                        if(category) {
                            currentUserRecipeCategories.push(category)
                        }
                        done()
                    })
                    .catch(done)
                }, () => {
                    res.render('recipes/show.ejs', {recipe: recipe, categories: currentUserRecipeCategories, recipeWasCreated})
                })
            }
            else {
                res.render('error')
            }
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


//DELETE /recipes/:id - delete recipe
router.delete('/:id', isLoggedIn, (req, res) => {

    // delete from user_savedrecipes join table
    db.recipe.destroy({
        where: {
            id: req.params.id
        }
    }).then(destroyedRecipeRows => {
        console.log(destroyedRecipeRows + '🌈🌈🌈🌈')
        
        //find all categories associated with current user
        db.category.findAll({
            where: {userId: req.user.id}
        })
        .then(categories => {
            //delete from recipe_categories table where recipeId = req.params.id and categoryId = categoryid associated with current user
            console.log(categories + '🐳🐳🐳🐳')
            async.forEach(categories, (c, done) => {
                db.recipes_categories.destroy({
                    where: {
                        categoryId: c.id,
                        recipeId: req.params.id
                    }
                })
                .then(destroyedJoinRows => {
                    console.log(destroyedJoinRows + '☀️☀️☀️☀️')
                    done()
                })
                .catch(done)
            }, ()=>{
                res.redirect('/recipes')
            })
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






//GET /recipes/:id/save - form for saving recipe
// router.get('/save/:id', (req, res) => {

//     res.send('save recipe form')
//     // req.body.
    
//     //     console.log(`https://api.spoonacular.com/recipes/extract?url=${recipe.url}&apiKey=${process.env.SPOON_API_KEY}`)
//     //     // axios.get(`https://api.spoonacular.com/recipes/extract?url=${recipe.url}&apiKey=${process.env.SPOON_API_KEY}`)
//     //     // .then(response => {
//     //     //     // let instructions = response.data
//     //     //     res.send(recipe)
//     //     //     // res.render('recipes/save.ejs', {recipe: recipe, categories: recipe.categories})
//     //     // })
//     //     // .catch(err => {
//     //     //     console.log(err)
//     //     // })
//     // })
//     // .catch(err => {
//     //     console.log(err)
//     //     res.render('error')
//     // })

// })


    // // FOR TESTING POST ROUTE FRONT-END
    // db.category.findAll({
    //     // where: {userId: req.user.id}
    //     where: {userId: 2}
    // })
    // .then(categories => {
    //     res.render('recipes/search/show.ejs', {
    //         recipe: {
    //             label: 'CHICKEN AND BURGERS',
    //             image: 'https://www.edamam.com/web-img/42f/42f1805b2273113c029b41adadd36847.jpg',
    //             source: 'Recipe Source',
    //             url: 'http://www.testwebsite.com',
    //             yield: 3,
    //             dietLabels: [
    //                 "Low-Fat"
    //                 ],
    //             healthLabels: [
    //                 "Peanut-Free",
    //                 "Tree-Nut-Free",
    //                 "Alcohol-Free"
    //                 ],
    //             ingredients: [
    //                 {
    //                 "text": "2 carrots , coarsely grated",
    //                 "weight": 122.0
    //                 },
    //                 {
    //                 "text": "250.0g leftover cooked rice , or a 250g pouch pre-cooked rice",
    //                 "weight": 250.0
    //                 },
    //                 {
    //                 "text": "1/3 cucumber , finely chopped",
    //                 "weight": 100.33333333333333
    //                 },
    //                 {
    //                 "text": "1.0 tsp clear honey",
    //                 "weight": 7.0625000003582175
    //                 },
    //                 {
    //                 "text": "20.0g pack mint leaves, roughly chopped",
    //                 "weight": 20.0
    //                 },
    //                 {
    //                 "text": "200.0g pack spicy cooked chicken fillets (we used Waitrose sweet chilli mini fillets)",
    //                 "weight": 200.0
    //                 },
    //                 {
    //                 "text": "pinch chilli powder",
    //                 "weight": 0.1666666668780043
    //                 },
    //                 {
    //                 "text": "150.0ml pot low-fat natural yogurt",
    //                 "weight": 155.33316678659128
    //                 }
    //                 ],
    //             calories: 500,
    //             totalTime: 20
    //         }, 
    //         instructionsText: "Chop the chicken into bite-size pieces and mix with the rice, cucumber and carrots.\nMix half the mint with the yogurt, honey, chilli powder, and seasoning. Stir into the rice and sprinkle with the remaining mint.", 
    //         instructionsObj: [
    //             {
    //             "name": "",
    //             "steps": [
    //             {
    //             "number": 1,
    //             "step": "Chop the chicken into bite-size pieces and mix with the rice, cucumber and carrots.",
    //             "ingredients": [
    //             {
    //             "id": 11206,
    //             "name": "cucumber",
    //             "image": "cucumber.jpg"
    //             },
    //             {
    //             "id": 11124,
    //             "name": "carrot",
    //             "image": "sliced-carrot.png"
    //             },
    //             {
    //             "id": 20444,
    //             "name": "rice",
    //             "image": "uncooked-white-rice.png"
    //             }
    //             ],
    //             "equipment": [ ]
    //             },
    //             {
    //             "number": 2,
    //             "step": "Mix half the mint with the yogurt, honey, chilli powder, and seasoning. Stir into the rice and sprinkle with the remaining mint.",
    //             "ingredients": [
    //             {
    //             "id": 2009,
    //             "name": "chili powder",
    //             "image": "chili-powder.jpg"
    //             },
    //             {
    //             "id": 1116,
    //             "name": "yogurt",
    //             "image": "plain-yogurt.jpg"
    //             },
    //             {
    //             "id": 19296,
    //             "name": "honey",
    //             "image": "honey.png"
    //             },
    //             {
    //             "id": 2064,
    //             "name": "mint",
    //             "image": "mint.jpg"
    //             },
    //             {
    //             "id": 20444,
    //             "name": "rice",
    //             "image": "uncooked-white-rice.png"
    //             }
    //             ],
    //             "equipment": [ ]
    //             }
    //             ]
    //             }
    //             ],
    //         time: 20,
    //         types: ['dinner'],
    //         categories: categories
    //     })
    // }).catch(err => {
    //         console.log(err)
    //         res.render('error')
    //     })
    // })