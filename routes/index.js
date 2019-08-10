const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

//use csrf protection
const csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cart' });
});

// route to register page
router.get('/user/register', (req, res, next)=> {
  const messages = req.flash('error');
  res.render('user/register',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});

});
//direct to profile if registration is successful
router.post('/user/register', passport.authenticate('local.register',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/register',
  failureFlash: true
}));

//route to profile page
router.get('/user/profile', (req, res, next)=>{
  res.render('user/profile')
});

//route to profile page
router.get('/user/login', (req, res, next)=>{
  const messages = req.flash('error');
  res.render('user/login',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});

//direct to profile if login successful
router.post('/user/login', passport.authenticate('local.login',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/login',
  failureFlash: true
}));




module.exports = router;
