const express = require('express');
const router = express.Router();
const autor = require("../controllers/signUp_signIn");
const crudArticulos = require('../Cruds/crudArticulo/crudArticulo');
const crudCliente = require('../Cruds/crudCliente/crudCliente');
const crudFGastos = require('../Cruds/crudFGastos/crudFGastos');
const crudFamilia = require('../Cruds/crudFamilia/crudFamilia');
const crudProveedores = require('../Cruds/crudProveedores/crudProveedores');
const restablecerPassword = require('../Restablecer/RestablecerPassword');
const multer = require('../Multer/multer');

// Rutas para CRUD
router.use("/", crudArticulos);
router.use("/", crudCliente);
router.use("/", crudFGastos);
router.use("/", crudFamilia);
router.use("/", crudProveedores);

// Rutas para autorización
router.post('/api/autorizacion/signup', autor.signUp);
router.post('/api/autorizacion/signin', autor.signIn);

// Ruta para cambiar la contraseña de un usuario
router.use('/', restablecerPassword);
// Ruta para el multer
router.use('/', multer);

module.exports = router;
