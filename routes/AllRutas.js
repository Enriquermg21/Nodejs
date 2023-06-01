const express = require('express');
const router = express.Router();
const autor = require("../controllers/signUp_signIn");
const crudArticulos = require('../Cruds/crudArticulo/crudArticulo');
const restablecerPassword = require('../Restablecer/RestablecerPassword');
const multer = require('../Multer/multer');

// Rutas para CRUD
router.use("/", crudArticulos);

// Rutas para autorización
router.post('/api/autorizacion/signup', autor.signUp);
router.post('/api/autorizacion/signin', autor.signIn);

// Ruta para cambiar la contraseña de un usuario
router.use('/', restablecerPassword);
// Ruta para el multer
router.use('/', multer);

module.exports = router;
