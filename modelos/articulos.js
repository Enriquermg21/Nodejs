const mongoose = require('mongoose');
const articulosSchema = new mongoose.Schema({
      Codigo: {
        type: String
      },
      Concepto: {
        type: String
      },
      Familia: {
        type: String
      },
      Proveedor: {
        type: String
      },
      Precio_Base: {
        type: String
      },
      Tarifa_1: {
        type: String
      },
      Tarifa_2: {
        type: String
      },
      Tarifa_3: {
        type: String
      },
      Tarifa_4: {
        type: String
      },
      nº_Decimales: {
        type: String
      },
      Iva: {
        type: String
      },
      stock: {
        type: String
      },
      Minimo: {
        type: String
      },
      Foto: {
        type: String
      },
      Observaciones: {
        type: String
      },
      
    },{ versionKey: false });
const Articulos = mongoose.model('Articulos', articulosSchema);
module.exports= Articulos;