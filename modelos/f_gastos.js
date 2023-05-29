const mongoose = require('mongoose');
const facGastosSchema = new mongoose.Schema({
      Numero: {
        type: String
      },
      Fecha: {
        type: String
      },
      Provedoor: {
        type: String
      },
      Cif: {
        type: String
      },
      base_1: {
        type: String
      },
      iva_1: {
        type: String
      },
      re_1: {
        type: String
      },
      base_2: {
        type: String
      },
      iva_2: {
        type: String
      },
      re_2: {
        type: String
      },
      base_3: {
        type: String
      },
      iva_3: {
        type: String
      },
      re_3: {
        type: String
      },
      base_4: {
        type: String
      },
      iva_4: {
        type: String
      },
      re_4: {
        type: String
      },
      base_5: {
        type: String
      },
      iva_5: {
        type: String
      },
      re_5: {
        type: String
      },
      base_Total: {
        type: String
      },
      iva_Total: {
        type: String
      },
      req_Total: {
        type: String
      },
      Total_Factura: {
        type: String
      },
      Nº_Factura: {
        type: String
      },
      Apartado: {
        type: String
      },
      Deducible: {
        type: String
      },
      Pagado: {
        type: String
      },
    },{ versionKey: false });
const FGastos = mongoose.model('FGastos', facGastosSchema);
module.exports= FGastos;