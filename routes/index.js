const express = require('express');
const router = express.Router();
const Product = require('../models/data');
const Cart = require('../models/cart');
const Order = require('../models/order');



/* GET home page. */
router.get('/', function(req, res, next) {
  const successMsg = req.flash('success')[0];
  res.render('index', { successMsg: successMsg, noMessage: !successMsg});
});

//load products on stuff page
router.get('/stuff', (req, res, next)=>{

  Product.find((err, result)=>{
    //rwo size variables
    var dataChunks = [];
    var chunkSize = 6;

      //paginate variables
    const pageSize = 6; //how many results by page
    const pageCount = Math.ceil(result.length/pageSize);
    let currentPage = 1; //set current page
    let resultList = [];

   //insert into dataChucks array
    for (var i = 0; i <result.length; i+=chunkSize){
      dataChunks.push(result.slice(i, i + chunkSize));
    }
    //set current page if specifed as get variable (eg: /?page=2)
if (typeof req.query.page !== 'undefined') {
  currentPage = +req.query.page;
}
//show list of products
resultList = dataChunks[+currentPage - 1];
    console.log();

    res.render('stuff',{ datas:resultList,
      pageSize: pageSize,
		  pageCount: pageCount,
		  currentPage: currentPage
    });

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
    res.redirect('/view_cart');
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
router.get('/checkout', isLoggedin, (req, res, next)=>{
  //check to see if a shopping cart exists
  if(!req.session.cart){
      return res.redirect('/view_cart');
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash('error')[0];
  return res.render('checkout',{total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg});
});

router.post('/checkout',isLoggedin,(req, res, next)=>{
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

  const order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name,
    paymentId: charge.id
  });

  //save order in database
  order.save((err, result)=>{
    //process after succesful transaction
    //Should install an if(err) statement at a later date
    req.flash('success', 'purchased!');
    req.session.cart = null;
    res.redirect('/');
    });
  });
});


module.exports = router;

//make sure users are authenticated before accessing checkout page
function isLoggedin(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  //save old Url
  req.session.oldUrl = req.url;
  res.redirect('/user/login');
}

//make sure users AREN'T logged in.
function notLoggedin(req, res, next){
  if (!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
