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
router.get('/user/login', (req, res, next)=> {
  const messages = req.flash('error');
  res.render('user/login',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});

});
router.post('/user/login', passport.authenticate('local.login',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/login',
  failureFlash: true
}));
router.get('/user/profile', (req, res, next)=>{
  res.render('user/profile')
});

module.exports = router;
