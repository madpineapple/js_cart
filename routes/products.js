const express = require('express');
const router = express.Router();
const Data = require('../models/data');

/* GET users listing. */
router.get('/stuff', (req, res, next)=>{
  const datas =Dat