const express = require('express');
const router = express.Router();
const FGastos = require('../modelos/f_gastos');

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
