const express = require('express');
const router = express.Router();
const Profesor = require('../models/profesores');

const Checkprofesores = async (req, res, next) => {
  const { id } = req.params;
  try {
    const profesor= await Profesor.findById(id);
    if (!profesor) {
      return res.status(404).json({ error: 'El profesor no existe.' });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar el profesor.' });
  }
};
router.get('/api/getPro', async function(req, res) {
  try {
    const profesores = await Profesor.find();
    res.status(200).json(profesores); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
});
/**
 * @swagger
 * /api/createPro:
 *   post:
 *     summary: Crea un nuevo profesor
 *     tags:
 *       - Profesores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *                 example: "Juan"
 *               Apellidos:
 *                 type: string
 *                 example: "Pérez Gómez"
 *     responses:
 *       201:
 *         description: Profesor creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 Nombre:
 *                   type: string
 *                 Apellidos:
 *                   type: string
 *       400:
 *         description: Error en los datos proporcionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El campo 'Nombre' es obligatorio"
 *       500:
 *         description: Error al crear el profesor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear el profesor"
 *    
 */
// CREATE
router.post('/api/createPro', async (req, res) => {
    const profesor = new Profesor({
      Nombre: req.body.Nombre,
      Apellidos: req.body.Apellidos,
    });
    try {
      const newprofesor = await profesor.save();
      res.status(201).json(newprofesor);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});
/**
 * @swagger
 * /api/deletePro/{id}:
 *   delete:
 *     summary: Elimina un profesor por su ID
 *     tags:
 *       - Profesores
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del profesor a eliminar
 *     responses:
 *       200:
 *         description: Profesor eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profesor eliminado correctamente"
 *       404:
 *         description: El profesor no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El profesor no existe"
 *       500:
 *         description: Error al eliminar el profesor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al eliminar el profesor"
 */
//DELETE 
router.delete('/api/deletePro/:id',Checkprofesores, async (req, res) => {
    try {
      const result = await Profesor.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'El Profesor no existe' });
      }
      res.json({ message: 'Profesor eliminado correctamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar el Profesor' });
    }
});
/**
 * @swagger
 * /api/putPro/{id}:
 *   put:
 *     summary: Actualiza un profesor por su ID
 *     tags:
 *       - Profesores
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del profesor a actualizar
 *       - in: body
 *         name: body
 *         description: Campos para actualizar del profesor
 *         schema:
 *           type: object
 *           properties:
 *             Nombre:
 *               type: string
 *             Apellidos:
 *               type: string
 *     responses:
 *       200:
 *         description: Profesor actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profesor'
 *       500:
 *         description: Error al actualizar el profesor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar el profesor"
 */
//PUT(ACTUALIZAR)
router.put('/api/putPro/:id',Checkprofesores, async (req, res) => {
    try {
      const id = req.params.id;
      const profesor = await Profesor.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(profesor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar el alumno.' });
    }
});
/**
 * @swagger
 * /api/patchPro/{id}:
 *   patch:
 *     summary: Actualiza un profesor por su ID
 *     tags:
 *       - Profesores
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del profesor a actualizar
 *       - in: body
 *         name: body
 *         description: Campos a actualizar del profesor
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             Nombre:
 *               type: string
 *             Apellidos:
 *               type: string
 *     responses:
 *       200:
 *         description: Profesor actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 6112a59b27e03d266c95f8b7
 *                 Nombre:
 *                   type: string
 *                   example: John
 *                 Apellidos:
 *                   type: string
 *                   example: Doe
 *       404:
 *         description: El profesor no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El profesor no existe"
 *       500:
 *         description: Error al actualizar el profesor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar el profesor"
 */ 
//PATCH(ACTUALIZAR INDIVIDUAL)
router.patch('/api/patchPro/:id',Checkprofesores, async (req, res) => {
    try {
      const { id } = req.params;
      const profesor = await Profesor.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true }
      );
      if (!profesor) {
        return res.status(404).send();
      }
      res.send(profesor);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
});



module.exports = router;
