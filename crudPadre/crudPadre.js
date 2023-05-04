const express = require('express');
const router = express.Router();
const Padre = require('../models/padre');

const Checkpadre = async (req, res, next) => {
    const { id } = req.params;
    try {
      const padre= await Padre.findById(id);
      if (!padre) {
        return res.status(404).json({ error: 'El padre no existe.' });
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al buscar el profesor.' });
    }
  };
  /**
 * @swagger
 * /api/patchPa/{id}:
 *   patch:
 *     summary: Añade un array de IDs de hijos al array de hijos de un padre por su ID
 *     tags:
 *       - Padres
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del padre al que se desea agregar el array de IDs de los hijos
 *       - in: body
 *         name: body
 *         description: Objeto que contiene el array de IDs de los hijos a agregar al array de hijos del padre.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hijos:
 *               type: array
 *               description: Array de IDs de los hijos del padre.
 *               items:
 *                 type: string
 *                 format: ObjectId
 *     responses:
 *       200:
 *        description: Array de IDs de hijos de padre actualizado correctamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                nombre:
 *                  type: string
 *                apellido:
 *                  type: string
 *                hijos:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        format: ObjectId
 *       404:
 *         description: No se encontró el padre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El padre no existe."
 *       500:
 *         description: Error al buscar o actualizar el padre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al buscar o actualizar el padre."
 */


  
  router.patch('/api/patchPa/:id',Checkpadre, async (req, res) => {
    try {
      const { id } = req.params;
      console.log(req.body)
      const padre = await Padre.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { new: true }
      );
      res.send(padre);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
});
  
  module.exports = router;

  