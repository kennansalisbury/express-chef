module.exports =  (req, res, next) => {
    //check if there is a user, call next so they go through
    if(req.user) {
        //someone is logged in, let them through
        next()  
    }
    else { //if no one is logged in, redirect
        req.flash('error', 'You must be logged in to view this page')
        res.redirect('/auth/login')
    }
    
}