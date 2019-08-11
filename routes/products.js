const express = require('express');
const router = express.Router();
const Product = require('../models/data');
const Cart = require('../models/cart')

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
  var productId = req.param.id;
  //create a new cart and check in session if old cart exits
  var cart = new Cart(req.session.cart ? req.session.cart: {});

  Product.findById(productId), function(err, product){
    if (err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    console.log(req.session.cart);
    res.redirect('/');
  }
})

module.exports = router;
