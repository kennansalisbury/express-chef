let axios = require('axios')
let router = require('express').Router()
let db = require('../models')
let async = require('async')

//middleware to confirm user logged in
let isLoggedIn = require('../middleware/isLoggedIn')


// GET /recipes/search - 1st page user sees when logged in, search recipes (api)
router.get('/search', (req, res) => {
    res.render('recipes/search/main.ejs')
})

// GET/recipes/search/results - results of search

router.get('/search/results', (req, res) => {
    // let q = req.query.search
    
    // axios.get(`https://api.edamam.com/search?q=${q}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
    // .then(response => {
    //     // res.send(response.data.hits)
    //     res.render('recipes/search/index.ejs', {recipes: response.data.hits})
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.render('error')
    // })

    res.render('recipes/search/index.ejs', {recipes: null})
})

// GET /recipes/search/result - show 1 selected search result from API
router.get('/search/result', (req, res) => {
    // let r = encodeURIComponent(req.query.url)
    // //get recipe data to show from edamam
    // axios.get(`https://api.edamam.com/search?r=${r}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`)
    // .then(response => {
    //     // console.log(response.data[0])
       
    //     let edamamRecipeUrl = response.data[0].url
        
    //     //put recipe URL through spoonacular api to recieve instructions
    //     axios.get(`https://api.spoonacular.com/recipes/extract?url=${edamamRecipeUrl}&apiKey=${process.env.SPOON_API_KEY}`)
    //     .then(spoonData => {
    //         //find all existing categories to pass through
    //         db.category.findAll({
                    //where userId = current user id
                //     where: {userId: user.id || 1}
                // })
    //         .then(categories => {
        
    //             //render show page with edamam and spoonacular data
    //             res.render('recipes/search/show.ejs', {
    //                 recipe: response.data[0], 
    //                 instructionsText: spoonData.data.instructions, 
    //                 instructionsObj: spoonData.data.instructions,
    //                 time: spoonData.data.readyInMinutes,
    //                 types: spoonData.data.dishTypes[0],
    //                 categories: categories
    //             })

    //         }).catch(err => {
    //             console.log(err)
    //             res.render('error')
    //         })
    //     }).catch(err => {
    //         console.log(err)
    //         res.render('error')
    //     })
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.render('error')
    // })


    //FOR TESTING FRONT-END
    db.category.findAll({
        where: {userId: user.id || 1}
    })
    .then(categories => {
        res.render('recipes/search/show.ejs', {
            recipe: {
                label: 'Recipe Name',
                image: 'http://place-puppy/200x200',
                source: 'Recipe Source',
                url: 'http://www.google.com',
                yield: 3,
                dietLabels: [
                    "Low-Fat"
                    ],
                healthLabels: [
                    "Peanut-Free",
                    "Tree-Nut-Free",
                    "Alcohol-Free"
                    ],
                ingredientlines: [
                    "2 carrots , coarsely grated",
                    "250.0g leftover cooked rice , or a 250g pouch pre-cooked rice",
                    "1/3 cucumber , finely chopped",
                    "1.0 tsp clear honey",
                    "20.0g pack mint leaves, roughly chopped",
                    "200.0g pack spicy cooked chicken fillets (we used Waitrose sweet chilli mini fillets)",
                    "pinch chilli powder",
                    "150.0ml pot low-fat natural yogurt"
                    ],
                ingredients: [
                    {
                    "text": "2 carrots , coarsely grated",
                    "weight": 122.0
                    },
                    {
                    "text": "250.0g leftover cooked rice , or a 250g pouch pre-cooked rice",
                    "weight": 250.0
                    },
                    {
                    "text": "1/3 cucumber , finely chopped",
                    "weight": 100.33333333333333
                    },
                    {
                    "text": "1.0 tsp clear honey",
                    "weight": 7.0625000003582175
                    },
                    {
                    "text": "20.0g pack mint leaves, roughly chopped",
                    "weight": 20.0
                    },
                    {
                    "text": "200.0g pack spicy cooked chicken fillets (we used Waitrose sweet chilli mini fillets)",
                    "weight": 200.0
                    },
                    {
                    "text": "pinch chilli powder",
                    "weight": 0.1666666668780043
                    },
                    {
                    "text": "150.0ml pot low-fat natural yogurt",
                    "weight": 155.33316678659128
                    }
                    ],
                calories: 500,
                totalTime: 20
            }, 
            instructionsText: "Chop the chicken into bite-size pieces and mix with the rice, cucumber and carrots.\nMix half the mint with the yogurt, honey, chilli powder, and seasoning. Stir into the rice and sprinkle with the remaining mint.", 
            instructionsObj: [
                {
                "name": "",
                "steps": [
                {
                "number": 1,
                "step": "Chop the chicken into bite-size pieces and mix with the rice, cucumber and carrots.",
                "ingredients": [
                {
                "id": 11206,
                "name": "cucumber",
                "image": "cucumber.jpg"
                },
                {
                "id": 11124,
                "name": "carrot",
                "image": "sliced-carrot.png"
                },
                {
                "id": 20444,
                "name": "rice",
                "image": "uncooked-white-rice.png"
                }
                ],
                "equipment": [ ]
                },
                {
                "number": 2,
                "step": "Mix half the mint with the yogurt, honey, chilli powder, and seasoning. Stir into the rice and sprinkle with the remaining mint.",
                "ingredients": [
                {
                "id": 2009,
                "name": "chili powder",
                "image": "chili-powder.jpg"
                },
                {
                "id": 1116,
                "name": "yogurt",
                "image": "plain-yogurt.jpg"
                },
                {
                "id": 19296,
                "name": "honey",
                "image": "honey.png"
                },
                {
                "id": 2064,
                "name": "mint",
                "image": "mint.jpg"
                },
                {
                "id": 20444,
                "name": "rice",
                "image": "uncooked-white-rice.png"
                }
                ],
                "equipment": [ ]
                }
                ]
                }
                ],
            time: 20,
            types: ['dinner'],
            categories: categories
        })
    }).catch(err => {
            console.log(err)
            res.render('error')
        })
    })


//POST /recipes - save a recipe to db
router.post('/', (req, res) => {
    let categories = []
    
    // check if there are either existing or new categories in form
    if(req.body.existing_categories){
        typeof req.body.existing_categories === 'string' ? categories = [req.body.existing_categories] : categories = req.body.existing_categories
    }

    if(req.body.new_categories){
        let newCategories = req.body.new_categories.split(',')
        categories = categories.concat(newCategories)
    }


    // find or create recipe
    db.recipe.findOrCreate({
        where: {
            sourceUrl: req.body.sourceUrl,
        },
        defaults: {
            title: req.body.title,
            source: req.body.source,
            imageUrl: req.body.imageUrl,
            time: req.body.time,
            servings: req.body.servings,
            ingredientsText: req.body.ingredientsText,
            ingredients: req.body.ingredients,
            instructionsText: req.body.instructionsText,
            instructions: req.body.instructions,
            dishTypes: req.body.type,
            dietLabels: req.body.diet,
            healthLabels: req.body.health,
            calories: req.body.calories,
        }
    })
    .then(([recipe, wasCreated]) => {
        console.log(wasCreated? recipe.title + ' was created' : recipe.title + ' was already found')
        
        //if there are categories, find or create

        if(categories.length){
            async.forEach(categories, (c, done) => {
                db.category.findOrCreate({
                    where: {
                        name: c.trim(),
                        userId: user.id || 1}
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
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})

//GET /recipes - show all saved recipes
router.get('/', (req, res) => {

    db.category.findAll({
        where: {
            userId: user.id || 1
        },
        include: [db.recipe]
    })
    .then(categories => {
        recipes = categories.recipes
        res.render('recipes/index.ejs', {recipes})
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})


// GET /recipes/:id - show 1 saved recipe
router.get('/:id', (req, res) => {
    let recipeWasCreated
    
    if(req.query.wasCreated) {
        recipeWasCreated = req.query.wasCreated
    }

    db.recipe.findByPk(req.params.id)
    .then(recipe => {
        res.render('recipes/show.ejs', {recipe, recipeWasCreated})
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