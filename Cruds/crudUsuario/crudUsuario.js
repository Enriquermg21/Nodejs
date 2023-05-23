const express = require('express');
const router = express.Router();
const Usuario = require('../modelos/usuario');

// CREATE
router.post('/api/usuarios', async (req, res) => {
  try {
    const { Nombre, Email, Password, Roles } = req.body;

    const contraseñaEncriptada = await Usuario.contraseñaEncriptada(Password);

    const usuario = new Usuario({
      Nombre,
      Email,
      Password: contraseñaEncriptada,
      Roles
    });

    const newUsuario = await usuario.save();
    res.status(201).json(newUsuario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// READ one
router.get('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// UPDATE
router.put('/api/usuarios/:id', async (req, res) => {
  try {
    const { Nombre, Email, Password, Roles } = req.body;

    const contraseñaEncriptada = await Usuario.contraseñaEncriptada(Password);

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      {
        Nombre,
        Email,
        Password: contraseñaEncriptada,
        Roles
      },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// DELETE
router.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const result = await Usuario.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
