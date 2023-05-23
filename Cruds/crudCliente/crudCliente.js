const express = require('express');
const router = express.Router();
const Cliente = require('../../modelos/clientes');

// CREATE
router.post('/api/clientes', async (req, res) => {
  try {
    const cliente = new Cliente({
      Razon_social: req.body.Razon_social,
      Personal_de_contacto: req.body.Personal_de_contacto,
      Direccion: req.body.Direccion,
      Ciudad: req.body.Ciudad,
      Provincia: req.body.Provincia,
      Codigo_Postal: req.body.Codigo_Postal,
      Telefono: req.body.Telefono,
      Movil: req.body.Movil,
      Descuento: req.body.Descuento,
      recargo_Eq: req.body.recargo_Eq,
      Observaciones: req.body.Observaciones,
      Foto: req.body.Foto,
      Correo_E: req.body.Correo_E,
      Login: req.body.Login,
      Password: req.body.Password,
      Tarifa: req.body.Tarifa
    });

    const newCliente = await cliente.save();
    res.status(201).json(newCliente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
});

// READ one
router.get('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
});

// UPDATE
router.put('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
});

//PATCH
router.patch('/api/clientes/:id', async (req, res) => {
  try {
    const patch = {
      $set: req.body // Utiliza el cuerpo de la solicitud como el parche
    };

    const cliente = await Cliente.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
});


// DELETE
router.delete('/api/clientes/:id', async (req, res) => {
  try {
    const result = await Cliente.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
});

module.exports = router;
