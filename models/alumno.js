const mongoose = require('mongoose');
const alumnoSchema = new mongoose.Schema({
      nombre: {
        type: String
      },
      Apellidos: {
        type: String
      },
      Edad: {
        type: String
      }
    },{ versionKey: false });
const Alumno = mongoose.model('Alumnos', alumnoSchema);
module.exports= Alumno;