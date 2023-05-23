const mongoose = require('mongoose');
const clienteSchema = new mongoose.Schema({
      Razon_social: {
        type: String
      },
      Personal_de_contacto: {
        type: String
      },
      Direccion: {
        type: String
      },
      Ciudad: {
        type: String
      },
      Provincia: {
        type: String
      },
      Codigo_Postal: {
        type: String
      },
      Telefono: {
        type: String
      },
      Movil: {
        type: String
      },
      Descuento: {
        type: String
      },
      recargo_Eq: {
        type: String
      },
      Observaciones: {
        type: String
      },
      Foto: {
        type: String
      },
      Correo_E: {
        type: String
      },
      Login: {
        type: String
      },
      Password: {
        type: String
      },
      Tarifa: {
        type: String
      },
      
    },{ versionKey: false });
const Cliente = mongoose.model('Clientes', clienteSchema);
module.exports= Cliente;