const express = require('express');
const router = express.Router();
const Familia = require('../../modelos/familia');
const PDFDocument = require('pdfkit');
const fs = require('fs');

router.get('/api/familias/pdf/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = req.query.filePath || './ruta/por/defecto/';

  try {
    const familias = await Familia.find();

    const doc = new PDFDocument();

    doc.font('Helvetica-Bold').fontSize(20).text('Familias', { align: 'center' }).moveDown();

    let numeroFamilia = 1;

    familias.forEach(familia => {
      doc.font('Helvetica-Bold').fontSize(12).text(`Familia #${numeroFamilia}`, { underline: true }).moveDown();

      doc.font('Helvetica').fontSize(12)
        .text(`Nombre: ${familia.Nombre}`)
        .moveDown();

      numeroFamilia++;
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

//PATCH
router.patch('/api/familias/:id', async (req, res) => {
  try {
    const patch = {
      $set: req.body // Utiliza el cuerpo de la solicitud como el parche
    };

    const familia = await Familia.findByIdAndUpdate(req.params.id, patch, { new: true });
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
