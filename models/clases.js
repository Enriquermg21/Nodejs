const mongoose = require('mongoose');
const claseSchema = new mongoose.Schema({
    nombre: {
        type: String
    },
    no_clases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso'
      }],
    no_asig:{
        type: mongoose.Schema.Types.ObjectId
    }
},{ versionKey: false });
const Clases = mongoose.model('Clases', claseSchema);
module.exports= Clases;