const express = require('express');
const router = express.Router();
const Product = require('../models/data');
const Cart = require('../models/cart')


/* GET home page. */
router.get('/', function(req, res, next) {
  const successMsg = req.flash('success')[0];
  res.render('index', { title: 'Cart' ,successMsg: successMsg, noMessage: !successMsg});
});

//load products on stuff page
router.get('/stuff', (req, res, next)=>{
  Product.find((err, docs)=>{
    //set row size
    var dataChunks = [];
    var chunkSize = 3;
    for (var i = 0; i <docs.length; i+=chunkSize){
      dataChunks.push(docs.slice(i, i + chunkSize));
    }
    console.log(docs.length);
    res.render('stuff',{ datas:docs});

  });
});
router.get('/add_to_cart/:id', function(req, res, next){
  var productId = req.params.id;
  //create a new cart and check in session if old cart exits
  var cart = new Cart(req.session.cart ? req.session.cart: {});

  Product.findById(productId, function(err, product){
    if (err){
      return res.redirect('/stuff');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/stuff');
  });
});

//View cart route
router.get('/view_cart', (req,res,next)=>{
  if(!req.session.cart){
    return res.render('view_cart', {products: null});
  }
  const cart = new Cart(req.session.cart);
  res.render('view_cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

//Checkout route
router.get('/checkout', (req, res, next)=>{
  //check to see if a shopping cart exists
  if(!req.session.cart){
      return res.redirect('/view_cart');
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash('error')[0];
  return res.render('checkout',{total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg});
});

router.post('/checkout',(req, res, next)=>{
  //check to see if a shopping cart exists
  if(!req.session.cart){
      return res.redirect('/view_cart');
  }
  const cart = new Cart(req.session.cart);
  //copied from stripe api
  const stripe = require("stripe")("HIDDEN");

 stripe.charges.create({
  amount: cart.totalPrice * 100,
  currency: "usd",
  source: req.body.stripeToken, // obtained with Stripe.js
  description: "Charge for jenny.rosen@example.com"
}, function(err, charge) {
  // asynchronously called
  if(err){
    req.flash('error', err.message);
    return res.redirect('/checkout');
  }
  req.flash('success', 'purchased!');
  req.session.cart = null;
  res.redirect('/');
});


});


module.exports = router;
