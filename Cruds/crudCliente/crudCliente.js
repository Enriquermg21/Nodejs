const express = require('express');
const router = express.Router();
const Cliente = require('../../modelos/clientes');
const PDFDocument = require('pdfkit');
const fs = require('fs');

router.get('/api/clientes/pdf/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = req.query.filePath || './ruta/por/defecto/';

  try {
    const clientes = await Cliente.find();

    const doc = new PDFDocument();

    doc.font('Helvetica-Bold').fontSize(20).text('Clientes', { align: 'center' }).moveDown();

    let numeroCliente = 1;

    clientes.forEach(cliente => {
      doc.font('Helvetica-Bold').fontSize(12).text(`Cliente #${numeroCliente}`, { underline: true }).moveDown();

      doc.font('Helvetica').fontSize(12)
        .text(`Razón Social: ${cliente.Razon_social}`)
        .text(`Personal de Contacto: ${cliente.Personal_de_contacto}`)
        .text(`Dirección: ${cliente.Direccion}`)
        .text(`Ciudad: ${cliente.Ciudad}`)
        .text(`Provincia: ${cliente.Provincia}`)
        .text(`Código Postal: ${cliente.Codigo_Postal}`)
        .text(`Teléfono: ${cliente.Telefono}`)
        .text(`Móvil: ${cliente.Movil}`)
        .text(`Descuento: ${cliente.Descuento}`)
        .text(`Recargo Equivalencia: ${cliente.recargo_Eq}`)
        .text(`Observaciones: ${cliente.Observaciones}`)
        .text(`Foto: ${cliente.Foto}`)
        .text(`Correo Electrónico: ${cliente.Correo_E}`)
        .text(`Login: ${cliente.login}`)
        .text(`Password: ${cliente.Password}`)
        .text(`Tarifa: ${cliente.Tarifa}`)
        .moveDown();

      numeroCliente++;
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
