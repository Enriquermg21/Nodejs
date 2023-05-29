const express = require('express');
const multer = require ("multer");
const { join, dirname } = require("path");
const router = express.Router();
const current_dir = dirname(__filename);
const multerUpload = multer({
    dest: join(current_dir,'../Uploads'),
    limits: {
        fileSize: 10000000, // Tamaño máximo del archivo en bytes (10 MB en este caso)
      },
});

router.post('/api/upload',multerUpload.single('file'),async (req, res) => {
  
    try {
        console.log(req.file);
        res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener el archivo' });
    }
  });

  module.exports = router;