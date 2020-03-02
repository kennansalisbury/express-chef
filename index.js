// Required node modules
require('dotenv').config()
let express = require('express')
let layouts = require('express-ejs-layouts')
let flash = require('connect-flash')
let session = require('express-session')
let cloudinary = require('cloudinary')
let methodOverride = require('method-override')

// Declare express app variable
let app = express()

let passport = require('./config/passportConfig')

// Set up and middleware
app.set('view engine', 'ejs')
app.use(layouts)
app.use('/', express.static('static'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: process.env.SESSION_SECRET
}))
app.use(flash())
app.use(passport.initialize()) 
app.use(passport.session()) 

// Custom middleware: Add variables to locals for each page
app.use((req, res, next) => {
    res.locals.alerts = req.flash() //allow flash/alert data on every page
    res.locals.user = req.user //allow user data on every page
    next()
})

// Add any controllers
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
app.use('/recipes', require('./controllers/recipes'))
app.use('/categories', require('./controllers/categories'))

// Add home or catch-all routes
app.get('/', (req, res) => {
    if(!req.user){
        res.render('home')
    } else {
        res.render('profile/home')
    }
})

// error/catch-all route
app.get('*', (req, res) => {
    res.render('error')
})

// Listen on local port
app.listen(process.env.PORT || 3000, () => { 
    console.log('👂🏻👂🏻👂🏻👂🏻')
})