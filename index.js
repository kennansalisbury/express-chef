// Required node modules
require('dotenv').config() //provide access to variables inside .env files
let express = require('express')
let layouts = require('express-ejs-layouts')
let flash = require('connect-flash')
let session = require('express-session')

// Declare express app varaiable
let app = express()

let passport = require('./config/passportConfig')

// Set up and middleware
app.set('view engine', 'ejs')
app.use(layouts)
app.use('/', express.static('static'))
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: process.env.SESSION_SECRET
}))
app.use(flash()) //depends on session; must come after app.use session statement
app.use(passport.initialize()) //depends on session; must come after app.use session statement
app.use(passport.session()) //depends on session; must come after app.use session statement

// Custom middleware: Add variables to locals for each page
app.use((req, res, next) => {
    res.locals.alerts = req.flash() //allows flash/alert data on every page
    res.locals.user = req.user //allows user data on every page
    next()
})

// Add any controllers
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
app.use('/recipes', require('./controllers/recipes'))

// Add home or catch-all routes
app.get('/', (req, res) => {
    // res.send('<h1>Hello World</h1>')
    res.render('home')
})

//error route - ALWAYS THE BOTTOM ROUTE
app.get('*', (req, res) => {
    res.render('error')
})

// Listen on local port
app.listen(process.env.PORT || 3000, () => { //process.env.PORT is for when pushing to production the server will automatically generate a port in env file to use
    console.log('👂🏻👂🏻👂🏻👂🏻')
})