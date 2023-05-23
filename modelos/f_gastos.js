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
      Base_1: {
        type: String
      },
      Iva_1: {
        type: String
      },
      Re_1: {
        type: String
      },
      Base_2: {
        type: String
      },
      Iva_2: {
        type: String
      },
      Re_2: {
        type: String
      },
      Base_3: {
        type: String
      },
      Iva_3: {
        type: String
      },
      Re_3: {
        type: String
      },
      Base_4: {
        type: String
      },
      Iva_4: {
        type: String
      },
      Re_4: {
        type: String
      },
      Base_5: {
        type: String
      },
      Iva_5: {
        type: String
      },
      Re_5: {
        type: String
      },
      Base_Total: {
        type: String
      },
      Iva_Total: {
        type: String
      },
      Req_Total: {
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