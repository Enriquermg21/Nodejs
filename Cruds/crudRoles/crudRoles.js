const express = require('express');
const router = express.Router();
const Role = require('../modelos/role');

// CREATE
router.post('/api/roles', async (req, res) => {
  try {
    const { Rol } = req.body;

    const role = new Role({
      Rol
    });

    const newRole = await role.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get('/api/roles', async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los roles' });
  }
});

// READ one
router.get('/api/roles/:id', async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el rol' });
  }
});

// UPDATE
router.put('/api/roles/:id', async (req, res) => {
  try {
    const { Rol } = req.body;

    const role = await Role.findByIdAndUpdate(req.params.id, { Rol }, { new: true });

    if (!role) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    res.json(role);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el rol' });
  }
});

// DELETE
router.delete('/api/roles/:id', async (req, res) => {
  try {
    const result = await Role.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json({ message: 'Rol eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el rol' });
  }
});

module.exports = router;
