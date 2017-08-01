var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImagenSchema = new Schema({
  usuario: String,
  titulo: String,
  descripcion: String,
  imagen: String,
  privado: String
});

mongoose.model('Imagen', ImagenSchema);
