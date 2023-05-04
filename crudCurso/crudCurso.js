const Curso = require('../models/curso');
const express = require('express');
const router = express.Router();

const checkcursos = async (req, res, next) => {
  const { id } = req.params;
  try {
    const curso = await Curso.findById(id);
    if (!curso) {
      return res.status(404).json({ error: 'El curso no existe.' });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar el curso.' });
  }
};
/**
 * @swagger
 * /api/createCu:
 *   post:
 *     summary: Crea un nuevo curso
 *     tags:
 *       - Cursos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               no_clases:
 *                 type: number
 *                 example: 10
 *               nombre:
 *                 type: string
 *                 example: "Curso de Programación"
 *     responses:
 *       200:
 *         description: Curso creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 no_clases:
 *                   type: number
 *                 nombre:
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
 *                   example: "El campo 'no_clases' es obligatorio"
 *       500:
 *         description: Error al crear el curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear el curso"
 *    
 */
// CREATE curso
router.post('/api/createCu',checkcursos, async (req, res) => {
    try {
      const curso = new Curso({
        no_clases: req.body.no_clases,
        nombre:req.body.nombre
      });
      const newCurso = await curso.save();
      res.send(newCurso);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});
/**
 * @swagger
 * /api/deleteCu/{id}:
 *   delete:
 *     summary: Elimina un curso por su ID
 *     tags:
 *       - Cursos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del curso a eliminar
 *     responses:
 *       200:
 *         description: Curso eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Curso eliminado correctamente"
 *       404:
 *         description: El curso no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El Curso no existe"
 *       500:
 *         description: Error al eliminar el curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al eliminar el curso"
 */
//DELETE
router.delete('/api/deleteCu/:id',checkcursos, async (req, res) => {
    try {
      const result = await Curso.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'El Curso no existe' });
      }
      res.json({ message: 'Curso eliminado correctamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar el Curso' });
    }
});
/**
 * @swagger
 * /api/putCu/{id}:
 *   put:
 *     summary: Actualiza un curso existente
 *     tags:
 *       - Cursos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del curso a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Programación Avanzada"
 *               no_clases:
 *                 type: number
 *                 example: 12
 *     responses:
 *       200:
 *         description: Curso actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 no_clases:
 *                   type: number
 *       404:
 *         description: El curso no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El curso no existe"
 *       500:
 *         description: Error al actualizar el curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar el curso"
 */
//PUT (ACTUALIZAR)
router.put('/api/putCu/:id',checkcursos, async (req, res) => {
    try {
      const id = req.params.id;
      const profesor = await Curso.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(profesor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar el alumno.' });
    }
});
/**
 * @swagger
 * /api/patchCu/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un curso existente
 *     tags:
 *       - Cursos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador único del curso a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Programación Avanzada"
 *               no_clases:
 *                 type: number
 *                 example: 12
 *     responses:
 *       200:
 *         description: Curso actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Error en los datos proporcionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El campo 'nombre' es obligatorio"
 *       404:
 *         description: El curso no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El curso no existe"
 *       500:
 *         description: Error al actualizar el curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar el curso"
 */
//PATCH (ACTUALIZAR INDIVIDUAL)  
router.patch('/api/patchCu/:id',checkcursos, async (req, res) => {
    try {
      const { id } = req.params;
      const profesor = await Curso.findOneAndUpdate(
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