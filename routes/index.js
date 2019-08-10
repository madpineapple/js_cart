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

/* GET users listing. */
router.get('/user/register', (req, res, next)=> {
  const messages = req.flash('error');
  res.render('user/register',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});

});
router.post('/user/register', passport.authenticate('local.register',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/register',
  failureFlash: true
}));
router.get('/user/profile', (req, res, next)=>{
  res.render('user/profile')
});

module.exports = router;
