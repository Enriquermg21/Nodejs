const express = require('express');
const multer = require ("multer");
const { join, dirname, extname } = require("path");
const router = express.Router();
const current_dir = dirname(__filename);
const multerUpload = multer({
    
    storage: multer.diskStorage({
        destination: join(current_dir,'../Uploads'),
        filename: (req,file,cb)=>{
            const extension = extname(file.originalname);
            const filename = file.originalname.split(extension)[0];

            cb(null,`${filename}-${Date.now()}${extension}`);
        },
    }),
    limits: {
        fileSize: 10000000000, // Tamaño máximo del archivo en bytes (10 MB en este caso)
      },
});

router.post('/api/upload',multerUpload.single('file'),async (req, res) => {
  
    try {
        res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener el archivo' });
    }
  });

router.use( '/api/download',express.static(join(current_dir,'../Uploads')))
    

  module.exports = router;