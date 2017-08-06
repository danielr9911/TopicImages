var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require('cloudinary');
var router = express.Router();
var upload = multer({dest:"./uploads"});
var Imagen = mongoose.model('Imagen');


cloudinary.config({
  cloud_name: "dani9911",
  api_key: "516813758795263",
  api_secret: "xI5qAFtv6J0nRwu2ljm5x15pxOU"
});

module.exports = function (app) {
  app.use('/', router);
};

/* Servicio Web: Despliega la lista de imagenes subidos por el usuario en la sesión actual.
     Método: GET
     URI: /perfil
*/
router.get('/perfil', ensureAuthenticated, function(req, res){
  Imagen.find({usuario:req.user.username},function (err, documento) {
    if(err){console.log(err);}
    res.render('perfil',{username:req.user.username, imagenes:documento, baseUrl: config.baseUrl});
  })
});

/* Servicio Web: Busca y muestra todas las imagenes en estado publico subidos por los usuarios
                 en la Base de datos.
     Método: GET
     URI: /public
*/
router.get('/public', ensureAuthenticated, function(req, res){
  Imagen.find({privado:"false"},function (err, documento) {
    if(err){console.log(err);}
    res.render('public', {username:req.user.username,imagenes:documento, baseUrl: config.baseUrl});
  });
});

/* Servicio Web: Filtra las imagenes publicas por usuario y los muestra.
     Método: POST
     URI: /buscar
*/
router.post('/buscar', function(req, res){
  Imagen.find({usuario:req.body.buscar, privado:"false"},function (err, documento) {
    if(err){console.log(err);}
    res.render('public', {username:req.user.username, imagenes:documento, baseUrl: config.baseUrl});
  });
});

/* Servicio Web: Entrada al formato de subir un archivo.
     Método: GET
     URI: /upload
*/
router.get('/upload', ensureAuthenticated, function(req, res){
  res.render('upload',{username:req.user.username, baseUrl: config.baseUrl});
});

/* Servicio Web: Elimina la publicación de la Base de datos.
  Método: DELETE
  URI: /delete/:id
*/
router.delete('/delete/:id',function (req, res) {
  var id_img = req.params.id;
  Imagen.remove({"_id":id_img},function (err) {
    if (err){console.log(err);}
    res.redirect("/perfil", {baseUrl: config.baseUrl});
  });
});

/* Servicio Web: Entrada al formato de actualización de los datos de la publicación.
     Método: GET
     URI: /edit/:id
*/
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
  var id_img = req.params.id;
  Imagen.findOne({"_id":id_img},function (err, image) {
    res.render('edit',{username:req.user.username, imagen:image, baseUrl: config.baseUrl});
  });
});

/* Servicio Web: Modifica los campos que se hayan cambiado en la publicación.
     Método: POST
     URI: /edit/:id
*/
router.post('/edit/:id', function (req, res) {
  console.log(req.body.titulo);
  var private = false;
  if(req.body.privado == 'on'){
    private = true;
  }
  var imagenData = {
    titulo : req.body.titulo,
    descripcion : req.body.descripcion,
    privado : private
  };
  console.log(imagenData);

  Imagen.update({"_id":req.params.id},imagenData, function () {
    res.redirect("/perfil", {baseUrl: config.baseUrl})
  });
});

/* Servicio Web: Almacena en la base de datos la referencia a la imagen junto con sus atributos.
     Método: POST
     URI: /upload
*/
router.post("/upload", upload.single('imagen'), function(req, res){

  var private = false;
  if(req.body.privado == 'on'){
    private = true;
  }
  var imagenData = {
    usuario: req.user.username,
    titulo : req.body.titulo,
    descripcion : req.body.descripcion,
    imagen : req.body.imagen,
    privado : private
  }
  var imagen = new Imagen(imagenData);

  cloudinary.uploader.upload(req.file.path,
    function(result) {
      imagen.imagen = result.url;
      imagen.save(function(err){
        res.render("index", {baseUrl: config.baseUrl});
      });
    }
  );
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect('/login', {baseUrl: config.baseUrl});
  }
}


