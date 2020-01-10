//Create express router object
let router = require('express').Router()
let db = require('../models')
let passport = require('../config/passportConfig')
let cloudinary = require('cloudinary')

// Define routes
router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile/home',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid credentials'
}))

router.get('/signup', (req, res) => {
    res.render('auth/signup', {data: {}})
})

router.post('/signup', (req, res, next) => {
    if(req.body.password !== req.body.ver_password) {
        req.flash('error', 'Passwords do not match!') //first argument is type of message, second argument is the message
        res.render('auth/signup', {data: req.body, alerts: req.flash()}) //pass through the existing form information
    } else {
        db.user.findOrCreate({
            where: {email: req.body.email},
            defaults: req.body
        })
        .then(([user, wasCreated]) => { //confirms if new user was created or not
            if(wasCreated) {
                // this is the intended user action
                // automatically log in the user to their newly created account
                passport.authenticate('local', {
                    successRedirect: '/profile/home',
                    failureRedirect: '/auth/login',
                    failureFlash: 'error: login unsucessful, try again'
                }) (req, res, next)
            } else {
                //the user already has an account
                req.flash('error', 'Account already exists - please log in below')
                res.redirect('/auth/login')
            }
        })
        .catch(err => {
            //Print out a general error to the terminal
            console.log('Error when creating a user', err)

            //check for validation errors (okay for user to see)
            if(err.errors) {
                err.errors.forEach(e => {
                    if(e.type === 'Validation error') {
                        req.flash('error', e.message)
                    }
                })
            } else {
                req.flash('error', 'something wrong happened')
            }
            res.redirect('/auth/signup')
        })
    }
})

router.get('/logout', (req, res) => {
    req.logout() // Throw away session data of logged in user
    res.redirect('/')
})

// FACEBOOK LOGIN ROUTES

//route that our app uses:
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}))

//route facebook uses (callback url):
router.get('/callback/facebook', passport.authenticate('facebook', {
    successRedirect: '/profile/home',
    failureRedirect: '/auth/login',
    failureFlash: 'Facebook login failed'
}))

// Export the router object so we can include it in other files
module.exports = router