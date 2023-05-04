const mongoose = require('mongoose');
const padreSchema = new mongoose.Schema({
      nombre: {
        type: String
      },
      apellido: {
        type: String
      },
      correo: {
        type: String
      },
      hijos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno'
      }]
    },{ versionKey: false });
const Padre = mongoose.model('Padre', padreSchema);
module.exports= Padre;