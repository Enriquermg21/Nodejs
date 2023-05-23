const express = require('express');
const router = express.Router();
const Familia = require('../modelos/familia');

// CREATE
router.post('/api/familias', async (req, res) => {
  try {
    const familia = new Familia({
      Nombre: req.body.Nombre
    });

    const newFamilia = await familia.save();
    res.status(201).json(newFamilia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get('/api/familias', async (req, res) => {
  try {
    const familias = await Familia.find();
    res.json(familias);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las familias' });
  }
});

// READ one
router.get('/api/familias/:id', async (req, res) => {
  try {
    const familia = await Familia.findById(req.params.id);
    if (!familia) {
      return res.status(404).json({ error: 'Familia no encontrada' });
    }
    res.json(familia);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la familia' });
  }
});

// UPDATE
router.put('/api/familias/:id', async (req, res) => {
  try {
    const familia = await Familia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!familia) {
      return res.status(404).json({ error: 'Familia no encontrada' });
    }
    res.json(familia);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la familia' });
  }
});

// DELETE
router.delete('/api/familias/:id', async (req, res) => {
  try {
    const result = await Familia.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Familia no encontrada' });
    }
    res.json({ message: 'Familia eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la familia' });
  }
});

module.exports = router;
