const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
      Rol: {
        type: String
      }
    },{ versionKey: false });
const Role = mongoose.model('Role', roleSchema);
module.exports= Role;