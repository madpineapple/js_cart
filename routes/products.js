const express = require('express');
const router = express.Router();
var Product = require('../models/data');

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

module.exports = router;
