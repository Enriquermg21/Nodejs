const mongoose = require('mongoose');
const familiaSchema = new mongoose.Schema({
      Nombre: {
        type: String
      },
      
    },{ versionKey: false });
const Familia = mongoose.model('Familia', familiaSchema);
module.exports= Familia;