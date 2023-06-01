const express = require('express');
const router = express.Router();
const Articulo = require('../../modelos/articulos');
const PDFDocument = require('pdfkit');
const fs = require('fs');

router.get('/api/articulos/pdf/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = req.query.filePath || './ruta/por/defecto/';

  try {
    const articulos = await Articulo.find();

    const doc = new PDFDocument();

    doc.font('Helvetica-Bold').fontSize(20).text('Articulos', { align: 'center' }).moveDown();

    articulos.forEach((articulo, index) => {
      const numeroArticulo = index + 1;
      doc.font('Helvetica-Bold').fontSize(12).text(`Artículo #${numeroArticulo}`, { underline: true }).moveDown();

      // Detalles del artículo
      doc.font('Helvetica').fontSize(12)
        .text(`Código: ${articulo.Codigo}`)
        .text(`Concepto: ${articulo.Concepto}`)
        .text(`Familia: ${articulo.Familia}`)
        .text(`Proveedor: ${articulo.Proveedor}`)
        .text(`Precio Base: ${articulo.Precio_Base}`)
        .text(`Tarifa 1: ${articulo.Tarifa_1}`)
        .text(`Tarifa 2: ${articulo.Tarifa_2}`)
        .text(`Tarifa 3: ${articulo.Tarifa_3}`)
        .text(`Tarifa 4: ${articulo.Tarifa_4}`)
        .text(`Nº Decimales: ${articulo['nºDecimales']}`)
        .text(`IVA: ${articulo.iva}`)
        .text(`Stock: ${articulo.stock}`)
        .text(`Mínimo: ${articulo.minimo}`)
        .text(`Foto: ${articulo.foto}`)
        .text(`Observaciones: ${articulo.Observaciones}`)
        .moveDown();
    });

    const timestamp = new Date().getTime();
    const outputFilePath = `${filePath}${timestamp}_${filename}`;
    doc.pipe(fs.createWriteStream(outputFilePath));
    doc.end();

    res.json({ message: 'PDF generado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al generar el PDF' });
  }
});



// CREATE
router.post('/api/articulos', async (req, res) => {
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
    const articulosQuery = Articulo.find();
    const articulos = await articulosQuery.exec();
    res.json(articulos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los artículos' });
  }
});

// READ one
router.get('/api/articulos/:id', async (req, res) => {
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
router.put('/api/articulos/:id', async (req, res) => {
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
//PATCH
router.patch('/api/articulos/:id', async (req, res) => {
  try {
    const patch = {
      $set: req.body // Utiliza el cuerpo de la solicitud como el parche
    };

    const articulo = await Articulo.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.json(articulo);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el artículo' });
  }
});

// DELETE
router.delete('/api/articulos/:id', async (req, res) => {
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
