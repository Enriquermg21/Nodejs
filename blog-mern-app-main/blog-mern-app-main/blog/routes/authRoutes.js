const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/verifyIs');
const autor = require("../controllers/signUp_signIn");
const crudProveedores = require('../Cruds/crudProveedores/crudProveedores');
const restablecerPassword = require('../Restablecer/RestablecerPassword');
const multer = require('../Multer/multer');

//auth routes
// /api/signup
router.post('/', autor);
// /api/signin
router.post('/', autor);
// /api/logout
router.get('/logout', logout);
// /api/me
router.get('/me', isAuthenticated, userProfile);



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

module.exports = router;