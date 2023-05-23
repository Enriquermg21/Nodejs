const express = require('express');
const router = express.Router();
const autor = require("../controllers/signUp_signIn");
const crudArticulos = require('../Cruds/crudArticulo/crudAlumno');
const crudCliente = require('../Cruds/crudCliente/crudCliente');
const crudFGastos = require('../Cruds/crudFGastos/crudFGastos');
const crudFamilia = require('../Cruds/crudFamilia/crudFamilia');
const crudProveedores = require('../Cruds/crudProveedores/crudProveedores');


//Rutas para Crud
router.use("/",crudArticulos)
router.use("/",crudCliente)
router.use("/",crudFGastos)
router.use("/",crudFamilia)
router.use("/",crudProveedores)

//Rutas para autorizacion
router.post('/api/autorizacion/signup',autor.signUp)
router.post('/api/autorizacion/signin',autor.signIn)*/

module.exports = router;