const express = require('express');
const router = express.Router();
const Articulos = require('../../modelos/articulos');
const Articulo = require('../../modelos/articulos');

// CREATE
router.post('/api/CrearArticulo', async (req, res) => {
  try {
    const articulo = new Articulo({
      Codigo: req.body.Codigo,
      Concepto: req.body.Concepto,
      Familia: req.body.Familia,
      Proveedor: req.body.Proveedor,
      Precio_Base: req.body.Precio_Base,
      Tarifa_1: req.body.Tarifa_1,
      Tarifa_2: req.body.Tarifa_2,
      Tarifa_3: req.body.Tarifa_3,
      Tarifa_4: req.body.Tarifa_4,
      "nº_Decimales": req.body["nº_Decimales"],
      Iva: req.body.Iva,
      stock: req.body.stock,
      Minimo: req.body.Minimo,
      Foto: req.body.Foto,
      Observaciones: req.body.Observaciones
    });

    const newArticulo = await articulo.save();
    res.status(201).json(newArticulo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get('/api/articulos', async (req, res) => {
  
  try {
    const articulosQuery = Articulos.find();
    const articulos = await articulosQuery.exec();
    res.json(articulos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los artículos' });
  }
});

// READ one
router.get('/api/getarticulos/:id', async (req, res) => {
  try {
    const articulo = await Articulo.findById(req.params.id);
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json(articulo);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el artículo' });
  }
});

// UPDATE
router.put('/api/Updatearticulos/:id', async (req, res) => {
  try {
    const articulo = await Articulo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json(articulo);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el artículo' });
  }
});

// DELETE
router.delete('/api/delarticulos/:id', async (req, res) => {
  try {
    const result = await Articulo.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json({ message: 'Artículo eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el artículo' });
  }
});

module.exports = router;
