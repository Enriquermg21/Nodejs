const Clases = require('../models/clases');
const express = require('express');
const router = express.Router();

const Checkclases = async (req, res, next) => {
  const { id } = req.params;
  try {
    const clase= await Clase.findById(id);
    if (!clase) {
      return res.status(404).json({ error: 'La clase no existe.' });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar la clase.' });
  }
};
/**
 * @swagger
 * /api/createCl:
 *   post:
 *     summary: Crea una nueva clase
 *     tags:
 *       - Clases
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Programación"
 *               no_clases:
 *                 type: number
 *                 example: 10
 *               no_asig:
 *                 type: number
 *                 example: 3
 *     responses:
 *       201:
 *         description: Clase creada correctamente
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
 *                 no_asig:
 *                   type: number
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
 *       500:
 *         description: Error al crear la clase
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al crear la clase"
 *    
 */
// CREATE
router.post('/api/createCl',Checkclases, async (req, res) => {
    try {
    const clase = new Clases({
      nombre: req.body.nombre,
      no_clases: req.body.no_clases,
      no_asig: req.body.no_asig
    });
      const newclase = await clase.save();
      res.status(201).json(newclase);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});
/**
 * @swagger
 * /api/deleteCl/{id}:
 *   delete:
 *     summary: Elimina una clase por su ID
 *     tags:
 *       - Clases
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la clase a eliminar
 *         example: 614e4c537f8cc7c4a9d26712
 *     responses:
 *       200:
 *         description: Clase eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Clase eliminada correctamente"
 *       404:
 *         description: No se encontró una clase con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La clase con el ID proporcionado no existe"
 *       500:
 *         description: Error al eliminar la clase
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al eliminar la clase"
 */
//Delete
router.delete('/api/deleteCl/:id',Checkclases, async (req, res) => {
    try {
      const result = await Clases.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'El Clases no existe' });
      }
      res.json({ message: 'Clases eliminado correctamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar el Clases' });
    }
});

/**
 * @swagger
 * /api/clases/{id}:
 *   put:
 *     summary: Actualiza una clase por su ID
 *     tags:
 *       - Clases
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la clase a actualizar
 *         example: 614e4c537f8cc7c4a9d26712
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
 *               no_asig:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Clase actualizada correctamente
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
 *                 no_asig:
 *                   type: number
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
 *         description: No se encontró una clase con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: La clase con el ID proporcionado no existe.
 *       500:
 *         description: Error al actualizar la clase
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar la clase.
 */

//PUT(ACTUALIZAR)
router.put('/api/putCl/:id',Checkclases, async (req, res) => {
    try {
      const id = req.params.id;
      const profesor = await Clases.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(profesor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar el alumno.' });
    }
});

/**
 * @swagger
 * /api/updateCl/{id}:
 *   patch:
 *     summary: Actualiza una clase por su ID
 *     tags:
 *       - Clases
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la clase a actualizar
 *         example: 614e4c537f8cc7c4a9d26712
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Programación"
 *               no_clases:
 *                 type: number
 *                 example: 12
 *               no_asig:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Clase actualizada correctamente
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
 *                 no_asig:
 *                   type: number
 *       404:
 *         description: No se encontró una clase con el ID proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: La clase con el ID proporcionado no existe.
 *       500:
 *         description: Error al actualizar la clase
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar la clase.
 */

//PATCH(ACTUALIZAR INDIVIDUAL)
router.patch('/api/patchCl/:id',Checkclases, async (req, res) => {
    try {
      const { id } = req.params;
      const profesor = await Clases.findOneAndUpdate(
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