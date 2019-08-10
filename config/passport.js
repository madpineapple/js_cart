const passport = require('passport');
const User = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;

//session code courtesy of passport.js
passport.serializeUser((user, done)=>{
  done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  User.findById(id, (err, user)=> {
    done(err, user);
  });
});

//check is user exists and create new user
passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done)=> {
  User.findOne({'email': email}, (err, user)=>{
    if (err){

      return done(err);
    }
    if (user){

      return done(null, false, {message:'Email is already in use'});

    }
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save((err, result)=>{
      if (err){
        return done(err);
      }return done(null, newUser);
    });
  });
}));
