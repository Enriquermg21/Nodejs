const express = require('express');
const router = express.Router();
const Alumno = require('../models/alumno');
const { verifyToken, isProfesor, isPadrecorreo } = require('../middleware/verifyIs');
  // Middleware
const checkAlumnoExists = async (req, res, next) => {
    const { id } = req.params;
    try {
      const alumno = await Alumno.findById(id);
      if (!alumno) {
        return res.status(404).json({ error: 'El alumno no existe.' });
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al buscar el alumno.' });
    }
  };
  
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Alumno:
 *       type: object
 *       required:
 *         - nombre
 *         - Apellidos
 *         - Edad
 *       properties:
 *         _id:
 *           type: string
 *         nombre:
 *           type: string
 *           description: Nombre del alumno.
 *         Apellidos:
 *           type: string
 *           description: Apellidos del alumno.
 *         Edad:
 *           type: number
 *           description: Edad del alumno.
 *       example:
 *         _id: 6090c5d5e820e56f5e5f5d32
 *         nombre: Juan
 *         Apellidos: Pérez López
 *         Edad: 10
 */

/**
 * @swagger
 * /api/profesor/getAl:
 *   get:
 *     summary: Obtener todos los alumnos
 *     tags:
 *       - Alumno
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna todos los alumnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alumno'
 *       401:
 *         description: No se proporcionó un token de autenticación válido
 *       403:
 *         description: El usuario no tiene permisos de profesor para acceder a la información
 *       500:
 *         description: Error en el servidor al obtener los alumnos
 */

  router.get('/api/profesor/getAl',verifyToken,isProfesor, async (req, res) => {
    try {
      const alumnos = await Alumno.find();
      res.status(200).json(alumnos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  /**
 * @swagger
 * /api/padre/getAl:
 *   get:
 *     summary: Obtener todos los alumnos
 *     tags:
 *       - Alumno
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna todos los alumnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alumno'
 *       401:
 *         description: No se proporcionó un token de autenticación válido
 *       403:
 *         description: El usuario no tiene permisos de padre para acceder a la información
 *       500:
 *         description: Error en el servidor al obtener los alumnos
 */

  router.get('/api/padre/getAl',verifyToken,isPadrecorreo, async (req, res) => {
    try {
      const alumnos = await Alumno.find();
      res.status(200).json(alumnos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

/**
 * @swagger
 * /api/createAl:
 *   post:
 *     summary: Crear un nuevo alumno
 *     tags:
 *       - Alumno
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos del alumno a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del alumno
 *                 example : Paco
 *               Apellidos:
 *                 type: string
 *                 description: Apellidos del alumno
 *                 example: Fernandez Gomez
 *               Edad:
 *                 type: number
 *                 description: Edad del alumno
 *                 example: 30
 *     responses:
 *       201:
 *         description: Alumno creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alumno'
 *       400:
 *         description: Error en los datos proporcionados para crear el alumno
 *       401:
 *         description: No se proporcionó un token de autenticación válido
 *       403:
 *         description: El usuario no tiene permisos de padre para crear un alumno
 *       500:
 *         description: Error en el servidor al crear el alumno
 */


  router.post('/api/createAl',verifyToken,isProfesor, async (req, res) => {
    const alumno = new Alumno({
      nombre: req.body.nombre,
      Apellidos: req.body.Apellidos,
      Edad: req.body.Edad,
    });
    try {
      const newalumno = await alumno.save();
      res.status(201).json(newalumno);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  /**
 * @swagger
 * /api/deleteAl/{id}:
 *   delete:
 *     summary: Eliminar alumno por id
 *     tags:
 *       - Alumno
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id del alumno a eliminar
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alumno eliminado correctamente
 *       401:
 *         description: No se proporcionó un token de autenticación válido
 *       403:
 *         description: El usuario no tiene permisos de profesor para acceder a la información
 *       404:
 *         description: No se encontró el alumno con el id proporcionado
 *       500:
 *         description: Error en el servidor al eliminar el alumno
 */

  router.delete('/api/deleteAl/:id',verifyToken,isProfesor, checkAlumnoExists, async (req, res) => {
    try {
      const result = await Alumno.findByIdAndDelete(req.params.id);
      res.json({ message: 'Alumno eliminado correctamente.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar el alumno.' });
    }
  });

  /**
 * @swagger
 * /api/putAl/{id}:
 *   put:
 *     summary: Actualizar alumno por id
 *     tags:
 *       - Alumno
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id del alumno a actualizar
 *         schema:
 *           type: string
 *       - in: body
 *         name: Alumno
 *         description: Campos del alumno a actualizar
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             Apellidos:
 *               type: string
 *             Edad:
 *               type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alumno actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alumno'
 *       400:
 *         description: No se proporcionaron los campos requeridos
 *       401:
 *         description: No se proporcionó un token de autenticación válido
 *       403:
 *         description: El usuario no tiene permisos de profesor para acceder a la información
 *       404:
 *         description: No se encontró el alumno con el id proporcionado
 *       500:
 *         description: Error en el servidor al actualizar el alumno
 */

  
  router.put('/api/putAl/:id',verifyToken,isProfesor, checkAlumnoExists, async (req, res) => {
    try {
      const id = req.params.id;
      const alumno = await Alumno.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(alumno);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar el alumno.' });
    }
  });
  
  /**
 * @swagger
 * /api/patchAl/{id}:
 *   patch:
 *     summary: Actualiza los datos de un alumno existente
 *     tags:
 *       - Alumno
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del alumno a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Campos a actualizar del alumno
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               Apellidos:
 *                 type: string
 *               Edad:
 *                 type: number
 *             example:
 *               nombre: Juan
 *               Apellidos: Perez
 *               Edad: 20
 *     responses:
 *       200:
 *         description: Alumno actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alumno'
 *       401:
 *         description: No se proporcionó un token de autenticación válido
 *       403:
 *         description: El usuario no tiene permisos de profesor para acceder a la información
 *       404:
 *         description: No se encontró el alumno especificado
 *       500:
 *         description: Error en el servidor al actualizar el alumno
 */

  router.patch('/api/patchAl/:id',verifyToken,isProfesor, checkAlumnoExists, async (req, res) => {
    try {
      const { id } = req.params;
      const profesor = await Alumno.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true }
      );
      res.send(profesor);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  module.exports = router;