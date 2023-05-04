const mongoose = require('mongoose');
const profesor = new mongoose.Schema({
  Nombre: {
    type: String
  },
  Apellidos: {
    type: String
  }
},{ versionKey: false });
const Profesor = mongoose.model('Profesores', profesor);
module.exports= Profesor;