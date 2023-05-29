const express = require('express');
const router = express.Router();
const FGastos = require('../../modelos/f_gastos');
const PDFDocument = require('pdfkit');
const fs = require('fs');

router.get('/api/facturas/pdf/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = req.query.filePath || './ruta/por/defecto/';

  try {
    const facturas = await FGastos.find();

    const doc = new PDFDocument();

    doc.font('Helvetica-Bold').fontSize(20).text('Facturas', { align: 'center' }).moveDown();

    let numeroFactura = 1;

    facturas.forEach(factura => {
      doc.font('Helvetica-Bold').fontSize(12).text(`Factura #${numeroFactura}`, { underline: true }).moveDown();

      doc.font('Helvetica').fontSize(12)
        .text(`Número: ${factura.Numero}`)
        .text(`Fecha: ${factura.Fecha}`)
        .text(`Proveedor: ${factura.Provedoor}`)
        .text(`CIF: ${factura.Cif}`)
        .text(`Base 1: ${factura.base_1}`)
        .text(`IVA 1: ${factura.iva_1}`)
        .text(`RE 1: ${factura.re_1}`)
        .text(`Base 2: ${factura.base_2}`)
        .text(`IVA 2: ${factura.iva_2}`)
        .text(`RE 2: ${factura.re_2}`)
        .text(`Base 3: ${factura.base_3}`)
        .text(`IVA 3: ${factura.iva_3}`)
        .text(`RE 3: ${factura.re_3}`)
        .text(`Base 4: ${factura.base_4}`)
        .text(`IVA 4: ${factura.iva_4}`)
        .text(`RE 4: ${factura.re_4}`)
        .text(`Base 5: ${factura.base_5}`)
        .text(`IVA 5: ${factura.iva_5}`)
        .text(`RE 5: ${factura.re_5}`)
        .text(`Base Total: ${factura.base_Total}`)
        .text(`IVA Total: ${factura.iva_Total}`)
        .text(`REQ Total: ${factura.req_Total}`)
        .text(`Total Factura: ${factura.Total_Factura}`)
        .text(`Nº Factura: ${factura['Nº_Factura']}`)
        .text(`Apartado: ${factura.Apartado}`)
        .text(`Deducible: ${factura.Deducible}`)
        .text(`Pagado: ${factura.Pagado}`)
        .moveDown();

      numeroFactura++;
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
router.post('/api/gastos', async (req, res) => {
  try {
    const gasto = new FGastos({
      Numero: req.body.Numero,
      Fecha: req.body.Fecha,
      Provedoor: req.body.Provedoor,
      Cif: req.body.Cif,
      Base_1: req.body.Base_1,
      Iva_1: req.body.Iva_1,
      Re_1: req.body.Re_1,
      Base_2: req.body.Base_2,
      Iva_2: req.body.Iva_2,
      Re_2: req.body.Re_2,
      Base_3: req.body.Base_3,
      Iva_3: req.body.Iva_3,
      Re_3: req.body.Re_3,
      Base_4: req.body.Base_4,
      Iva_4: req.body.Iva_4,
      Re_4: req.body.Re_4,
      Base_5: req.body.Base_5,
      Iva_5: req.body.Iva_5,
      Re_5: req.body.Re_5,
      Base_Total: req.body.Base_Total,
      Iva_Total: req.body.Iva_Total,
      Req_Total: req.body.Req_Total,
      Total_Factura: req.body.Total_Factura,
      'Nº_Factura': req.body['Nº_Factura'],
      Apartado: req.body.Apartado,
      Deducible: req.body.Deducible,
      Pagado: req.body.Pagado
    });

    const newGasto = await gasto.save();
    res.status(201).json(newGasto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get('/api/gastos', async (req, res) => {
  try {
    const gastos = await FGastos.find();
    res.json(gastos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los gastos' });
  }
});

// READ one
router.get('/api/gastos/:id', async (req, res) => {
  try {
    const gasto = await FGastos.findById(req.params.id);
    if (!gasto) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    res.json(gasto);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el gasto' });
  }
});

// UPDATE
router.put('/api/gastos/:id', async (req, res) => {
  try {
    const gasto = await FGastos.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gasto) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    res.json(gasto);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el gasto' });
  }
});

//PATCH
router.patch('/api/facturas-gastos/:id', async (req, res) => {
  try {
    const patch = {
      $set: req.body // Utiliza el cuerpo de la solicitud como el parche
    };

    const facturaGastos = await FGastos.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!facturaGastos) {
      return res.status(404).json({ error: 'Factura de gastos no encontrada' });
    }
    res.json(facturaGastos);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la factura de gastos' });
  }
});

// DELETE
router.delete('/api/gastos/:id', async (req, res) => {
  try {
    const result = await FGastos.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    res.json({ message: 'Gasto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el gasto' });
  }
});

module.exports = router;
