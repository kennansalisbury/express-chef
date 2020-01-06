//Read ENV Values
require('dotenv').config()

// Require passport and any passport strategies you wish to use
let passport = require('passport')
let FacebookStrategy = require('passport-facebook').Strategy
let LocalStrategy = require('passport-local').Strategy //using uppercase because this is a Class

// Reference the models folder to access the database
let db = require('../models')

// Serialization and Deserialization functions
// These are for passport to use to store/lookup the user info

// Serialize: reduce the user to just the unique ID
passport.serializeUser((user, cb) => {
    // callback function (cb) params: error message (null if no error), user data (only the id)
    cb(null, user.id)
})

// Deserialize: takes a user ID and looks up the rest of the info
passport.deserializeUser((id, cb) => {
    db.user.findByPk(id)
    .then(user => {
        cb(null, user)
    })
    .catch(cb) // since error message is first argument of callback, can do this
})

// Implement the Local Strategy (local database)
//this will tell us if information entered is correct
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb) => {
    //Try looking up user by their email
    db.user.findOne({
        where: { email: email}
    })
    .then(foundUser => {
        // check if I found a user; then check their password
        if (!foundUser || !foundUser.validPassword(password)) { //if no found user, or if found user but password is not valid
            //bad user or bad password
           cb(null, null) 
        } else { 
            //valid user and password
            cb(null, foundUser)
        }
    })
    .catch(cb)
}))


//Implement Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/callback/facebook',
    profileFields: ['id', 'email', 'displayName', 'photos', 'birthday']
}, (accessToken, refreshToken, profile, cb) => {
    //grab facebook primary email
    let facebookEmail = profile.emails[0].value
    let displayName = profile.displayName.split(' ')
    let photo = profile.photos.length ? profile.photos[0].value : 'ttp://place-puppy.com/200x200'

    //look for email in local database - do not duplicate
    db.user.findOrCreate({
        where: {email: facebookEmail},
        defaults: {
            facebookToken: accessToken,
            facebookId: profile.id,
            firstname: displayName[0],
            lastname: displayName[displayName.length - 1],
            username:  profile.username || displayName[0],
            photoURL: photo,
            birthdate: profile._json.birthday,
            bio: `${profile.displayName} created this account with Facebook`
        }
    })
    .then(([user, wasCreated]) => {
        if (wasCreated || user.facebookId) { //new user created, not found already in local database
            cb(null, user)
        } else { //we found an existing user (add FB id and token)
            user.update({
                facebookId: profile.id,
                facebookToken: accessToken
            })
            .then(updatedUser => {
                cb(null, updatedUser)
            })
            .catch(cb)
        }
    })
        .catch(cb)
}))

module.exports = passport