const express = require('express');
const multer = require ("multer");
const dirname = require("path");
const fileURLToPath = require("url");
const router = express.Router();
const current_dir = dirname(fileURLToPath(import.meta.url));
const multerUpload = multer({
    dest: join(current_dir,'../Uploads'),
    limits: {
        fileSize: 10000000, // Tamaño máximo del archivo en bytes (10 MB en este caso)
      },
});

router.post('/api/upload',multerUpload.fields('file'),async (req, res) => {
  
    try {
        console.log(req.file);
        res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener el archivo' });
    }
  });