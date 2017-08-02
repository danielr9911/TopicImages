var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app) {
  app.use('/', router);
};

var User = require('../models/user');

// Registro
router.get('/register', function(req, res){
  res.render('register');
});

// Login
router.get('/login', function(req, res){
  res.render('login');
});

// Register User
router.post('/register', function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody('name', 'Nombre es necesario').notEmpty();
  req.checkBody('email', 'Email es necesario').notEmpty();
  req.checkBody('email', 'Email no valido').isEmail();
  req.checkBody('username', 'Usuario es necesario').notEmpty();
  req.checkBody('password', 'Contraseña es necesario').notEmpty();
  req.checkBody('password2', 'Las contraseñas no coinciden').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors:errors
    });
  } else {
    var newUser = new User({
      name: name,
      email:email,
      username: username,
      password: password
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'Registro exitoso');

    res.redirect('/login');
  }
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Usuario desconocido'});
      }

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Contraseña incorrecta'});
        }
      });
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/public');
  });

router.get('/logout', function(req, res){
  req.logout();

  req.flash('success_msg', 'Desconectado exitosamente');

  res.redirect('/login');
});

//Configuracion de cuenta
router.get('/account', function (req, res) {
  User.getUserByUsername(req.user.username, function (err, user) {
    console.log(user);
    res.render('account', {usuario: user});
  });
});

router.post('/account', function (req, res) {
    res.render('account')
  });

//module.exports = router;
