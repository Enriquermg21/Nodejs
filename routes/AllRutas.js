const express = require('express');
const router = express.Router();
const autor = require("../controllers/signUp_signIn");
const crudAlumnos = require('../crudAlumno/crudAlumno');
const crudProfesor = require('../crudProfesor/crudProfesor');
const crudClases = require('../crudClases/crudClases');
const crudCurso = require('../crudCurso/crudCurso');
const crudPadre = require('../crudPadre/crudPadre');
const userPdf_Html = require("../Pdf_Html/Pdf_Html");

//Ruta para hacer un Pdf y un HTML
router.use("/",userPdf_Html)

//Rutas para Crud
router.use("/",crudAlumnos)
router.use("/",crudProfesor)
router.use("/",crudClases)
router.use("/",crudCurso)
router.use("/",crudPadre)

//Rutas para autorizacion
router.post('/api/autorizacion/signup',autor.signUp)
router.post('/api/autorizacion/signin',autor.signIn)

module.exports = router;