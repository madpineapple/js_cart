const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

//use csrf protection
const csrfProtection = csrf();
router.use(csrfProtection);

//route to profile page
router.get('/profile', isLoggedin, (req, res, next)=>{
  res.render('profile')
});

//logout router
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/');
})


//check if users aren't logged in.
router.use('/', notLoggedin,(req, res, next)=>{
  next();
})

// route to register page
router.get('/register', (req, res, next)=> {
  const messages = req.flash('error');
  res.render('register',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});

});
//direct to profile if registration is successful
router.post('/register', passport.authenticate('local.register',{
  successRedirect: '/user/profile',
  failureRedirect: '/register',
  failureFlash: true
}));



//route to profile page
router.get('/login', (req, res, next)=>{
  const messages = req.flash('error');
  res.render('login',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

//direct to profile if login successful
router.post('/login', passport.authenticate('local.login',{
  successRedirect: '/user/profile',
  failureRedirect: '/login',
  failureFlash: true
}));



module.exports = router;

//make sure users are authenticated before accessing profile page
function isLoggedin(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

//make sure users AREN'T logged in.
function notLoggedin(req, res, next){
  if (!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
