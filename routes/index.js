const express = require('express');
const router = express.Router();
const csrf = require('csurf');

//use csrf protection
const csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cart' });
});

/* GET users listing. */
router.get('/user/login', (req, res, next)=> {

  res.render('user/login',{csrfToken: req.csrfToken()});

});
router.post('/user/login',(req,res, next)=>{
  res.redirect('/');
});

module.exports = router;
