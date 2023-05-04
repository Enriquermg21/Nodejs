const mongoose = require('mongoose');
const cursoSchema = new mongoose.Schema({
  nombre: {
    type: String
  },
  no_clases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso'
  }]
  
},{ versionKey: false });

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;