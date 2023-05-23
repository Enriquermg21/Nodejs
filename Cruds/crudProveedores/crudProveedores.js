const express = require('express');
const router = express.Router();
const Proveedor = require('../../modelos/proveedores');

// CREATE
router.post('/api/proveedores', async (req, res) => {
  try {
    const proveedor = new Proveedor({
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
      Pag_Web: req.body.Pag_Web
    });

    const newProveedor = await proveedor.save();
    res.status(201).json(newProveedor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get('/api/proveedores', async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

// READ one
router.get('/api/proveedores/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el proveedor' });
  }
});

// UPDATE
router.put('/api/proveedores/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
});

//PATCH
router.patch('/api/proveedores/:id', async (req, res) => {
  try {
    const patch = {
      $set: req.body // Utiliza el cuerpo de la solicitud como el parche
    };

    const proveedor = await Proveedor.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
});


// DELETE
router.delete('/api/proveedores/:id', async (req, res) => {
  try {
    const result = await Proveedor.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el proveedor' });
  }
});

module.exports = router;
