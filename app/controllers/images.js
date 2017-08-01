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

// Perfil
router.get('/perfil', function(req, res){
  Imagen.find({usuario:req.user.username},function (err, documento) {
    if(err){console.log(err);}
    res.render('perfil',{username:req.user.username, imagenes:documento});
  })
});

// Contenido publico
router.get('/public', function(req, res){
  Imagen.find({privado:"false"},function (err, documento) {
    if(err){console.log(err);}
    res.render('public', {username:req.user.username,imagenes:documento});
  });
});

router.post('/buscar', function(req, res){
  Imagen.find({usuario:req.body.buscar, privado:"false"},function (err, documento) {
    if(err){console.log(err);}
    res.render('public', {username:req.user.username, imagenes:documento});
  });
});

// Upload
router.get('/upload', function(req, res){
  res.render('upload',{username:req.user.username});
});

//Delete
router.delete('/delete/:id',function (req, res) {
  var id_img = req.params.id;
  Imagen.remove({"_id":id_img},function (err) {
    if (err){console.log(err);}
    res.redirect("/perfil");
  });
});

router.get('/edit/:id', function (req, res) {
  var id_img = req.params.id;
  Imagen.findOne({"_id":id_img},function (err, image) {
    res.render('edit',{username:req.user.username, imagen:image});
  });
});

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
    res.redirect("/perfil")
  });
});

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
        res.render("index");
      });
    }
  );
})

