var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var mongoose = require('mongoose');

module.exports = function (app) {
  app.use('/', router);
};

var User = require('../models/user');
var Imagen = mongoose.model('Imagen');

/* Servicio Web: Entrada al formato de Registro de usuarios.
  Método: GET
  URI: /register
*/
router.get('/register', function(req, res){
  res.render('register');
});

/* Servicio Web: Entrada al formato de Inicio de sesión.
  Método: GET
  URI: /login
*/
router.get('/login', function(req, res){
  res.render('login');
});

/* Servicio Web: Inserta un Nuevo Usuario en la Base de datos
  Método: POST
  URI: /registrar
*/
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

/* Servicio Web: Realiza la autenticación del usuario para ingresar.
  Método: POST
  URI: /login
*/
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/public');
  });

/* Servicio Web: Finaliza la sesión actual y redirige al formato de Inicio de sesión.
  Método: GET
  URI: /logout
*/
router.get('/logout', ensureAuthenticated, function(req, res){
  req.logout();

  req.flash('success_msg', 'Desconectado exitosamente');

  res.redirect('/login');
});

/* Servicio Web: Busca y muestra los datos del usuario en la Base de datos.
     Método: GET
     URI: /account
*/
router.get('/account', ensureAuthenticated, function (req, res) {
  User.getUserByUsername(req.user.username, function (err, user) {
    console.log(user);
    res.render('account', {usuario: user});
  });
});

/* Servicio Web: Modifica los datos del usuario en la Base de datos.
  Método: POST
  URI: /account
*/
router.post('/account', function (req, res) {
  var userData = {
    name: req.body.name,
    email: req.body.email
  };
  var userId = req.user._id;
  console.log(userId);
  User.update({"_id":userId}, userData, function () {
    res.redirect('/account');
  });
});

/* Servicio Web: Elimina el usuario y sus archivos de la Base de datos.
  Método: DELETE
  URI: /deleteAccount
*/
router.delete('/deleteAccount', function (req, res) {
  var userId = req.user._id;
  var userName = req.user.username;
  User.remove({"_id":userId},function (err) {
    if (err){console.log(err);}
    Imagen.remove({"usuario":userName},function (err) {
      if (err){console.log(err);}
    });
    res.redirect("/");
  });
});

/* Servicio Web: Modifica la contraseña en la Base de datos.
  Método: POST
  URI: /changePassword
*/
router.post('/changePassword', function(req, res) {
  var usuario = req.user.username;
  var clave = req.body.passwordAct;
  var nuevaClave = req.body.password;
  var repetirClave = req.body.password2;

  if (nuevaClave === repetirClave) {
    var coinciden = true;
  }
  console.log(coinciden);

  User.findOne({"username": usuario}, function (err, user) {
    console.log(user.password);
    User.comparePassword(clave, req.user.password, function (err, isMatch) {
      if (isMatch) {
        console.log(isMatch);
        if (!coinciden) {
          req.flash('error_msg','Las contraseñas no coinciden');
          res.redirect('/account')
        }else{
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(nuevaClave, salt, function (err, hash) {
              var claveNueva = hash;
              console.log(claveNueva);

              var claveData = {
                password : claveNueva
              };
              User.update({"username": usuario}, claveData , function () {
                req.flash('success_msg', 'Contraseña cambiada exitosamente');
                res.redirect("/account")
              });
            });
          });
        }
      }else{
        req.flash('error_msg', 'Contraseña incorrecta');
        res.redirect('/account')
      }
    });
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/login');
  }
}
//module.exports = router;


