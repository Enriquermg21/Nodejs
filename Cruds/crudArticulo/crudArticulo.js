const express = require('express');
const Articulo = require('../../modelos/articulos');
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
// Crear un nuevo artículo
router.post('/api/CrearArti', multerUpload.single('file'), async (req, res, next) => {
  try {
    const { titulo, contenido, publicado, likes, comentarios } = req.body;

    const articulo = await Articulo.create({
      titulo,
      contenido,
      publicado,
      imagen: {
        url: req.file.path,
        public_id: req.file.filename
      },
      likes,
      comentarios
    });

    res.status(201).json({
      success: true,
      articulo
    });
  } catch (error) {
    next(error);
  }
});

// Obtener todos los artículos
router.get('/api/MostrarArtis', async (req, res, next) => {
  try {
    const articulos = await Articulo.find().sort({ createdAt: -1 }).populate('publicado', 'name');
    res.status(200).json({
      success: true,
      articulos
    });
  } catch (error) {
    next(error);
  }
});

// Obtener un artículo por su ID
router.get('/api/MostrarArti/:id', async (req, res, next) => {
  try {
    const articulo = await Articulo.findById(req.params.id).populate('comentarios.publicadoPor', 'name');
    if (!articulo) {
      return res.status(404).json({
        success: false,
        message: 'El artículo no existe'
      });
    }
    res.status(200).json({
      success: true,
      articulo
    });
  } catch (error) {
    next(error);
  }
});

// Actualizar un artículo
router.put('/api/ActualizarArti/:id', multerUpload.single('imagen'), async (req, res, next) => {
  try {
    const { titulo, contenido, publicado } = req.body;
    const updateData = {
      titulo,
      contenido,
      publicado
    };

    if (req.file) {
      updateData.imagen = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const articulo = await Articulo.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!articulo) {
      return res.status(404).json({
        success: false,
        message: 'El artículo no existe'
      });
    }

    res.status(200).json({
      success: true,
      articulo
    });
  } catch (error) {
    next(error);
  }
});

// Eliminar un artículo
router.delete('/api/BorrarArti/:id', async (req, res, next) => {
  try {
    const articulo = await Articulo.findByIdAndDelete(req.params.id);
    if (!articulo) {
      return res.status(404).json({
        success: false,
        message: 'El artículo no existe'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Artículo eliminado'
    });
  } catch (error) {
    next(error);
  }
});

// Agregar un comentario al artículo
router.post('/api/articulos/:id/comentarios', async (req, res, next) => {
  try {
    const { comentario } = req.body;
    const articulo = await Articulo.findById(req.params.id);

    if (!articulo) {
      return res.status(404).json({
        success: false,
        message: 'El artículo no existe'
      });
    }

    articulo.comentarios.push({
      texto: comentario,
      publicadoPor: req.user._id
    });

    await articulo.save();

    res.status(200).json({
      success: true,
      articulo
    });
  } catch (error) {
    next(error);
  }
});

// Darle like a un artículo
router.put('/api/articulos/:id/like', async (req, res, next) => {
  try {
    const articulo = await Articulo.findById(req.params.id);

    if (!articulo) {
      return res.status(404).json({
        success: false,
        message: 'El artículo no existe'
      });
    }

    if (articulo.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Ya le has dado like a este artículo'
      });
    }

    articulo.likes.push(req.user._id);
    await articulo.save();

    res.status(200).json({
      success: true,
      articulo
    });
  } catch (error) {
    next(error);
  }
});

// Quitarle like a un artículo
router.put('/api/articulos/:id/unlike', async (req, res, next) => {
  try {
    const articulo = await Articulo.findById(req.params.id);

    if (!articulo) {
      return res.status(404).json({
        success: false,
        message: 'El artículo no existe'
      });
    }

    if (!articulo.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'No le has dado like a este artículo'
      });
    }

    articulo.likes.pull(req.user._id);
    await articulo.save();

    res.status(200).json({
      success: true,
      articulo
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
