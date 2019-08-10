const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var userSchema = new Schema({
  email: {type: String, required:true},
  password: {type: String, required:true}
});

//encrypt password using bcrypt
userSchema.methods.encryptPassword = (password)=>{
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

//check if  passwords are the same
userSchema.methods.validPassword = (password)=>{
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
