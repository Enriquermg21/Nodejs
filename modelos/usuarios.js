const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
  Nombre: {
    type: String,
    Unique: true
  },
  Email: {
    type: String,
    Unique: true
  },
  Password: {
    type: String,
    require: true
  },
  Roles: [{
    ref : "Role",
    type : mongoose.Schema.Types.ObjectId
  }]
},{ versionKey: false,timestamps:true });

    //Metodos para las contraseñas

    userSchema.statics.contraseñaEncriptada = async (Password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(Password, salt);
    }
    userSchema.statics.compararContraseña = async (Password,contraseñaEncriptada) =>{
      return await bcrypt.compare(Password,contraseñaEncriptada)
    }


    module.exports = mongoose.model('User', userSchema);