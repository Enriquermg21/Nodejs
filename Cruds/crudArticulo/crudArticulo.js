const express = require('express');
const Articulo = require('../../modelos/articulos');
const multer = require("multer");
const { join, dirname, extname } = require("path");
const router = express.Router();

const current_dir = dirname(__filename);
const multerUpload = multer({
  storage: multer.diskStorage({
    destination: join(current_dir, '../Uploads'),
    filename: (req, file, cb) => {
      const extension = extname(file.originalname);
      const filename = file.originalname.split(extension)[0];
      cb(null, `${filename}-${Date.now()}${extension}`);
    },
  }),
  limits: {
    fileSize: 10000000000, // Tamaño máximo del archivo en bytes (10 MB en este caso)
  },
});

// Importar funciones de autenticación
const { verificarSesion, verificarAdmin } = require('../../middleware/auth');
const { verifyToken } = require('../../middleware/verifyIs');

// Crear un nuevo artículo
router.post('/api/CrearArti', verificarSesion, multerUpload.single('imagen'), async (req, res, next) => {
  try {
    const { titulo, contenido, publicado } = req.body;

    const articulo = await Articulo.create({
      titulo,
      contenido,
      publicado,
      imagen: {
        url: req.file.path,
        public_id: req.file.filename
      },
    });
  } catch (error) {
    next(error);
  }
});

// Obtener todos los artículos
router.get('/api/MostrarArti', async (req, res, next) => {
  try {
    const articulos = await Articulo.find().sort({ createdAt: -1 });
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
    const articulo = await Articulo.findById(req.params.id);
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
router.put('/api/ActualizarArti/:id', verificarSesion, multerUpload.single('imagen'), async (req, res, next) => {
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
router.delete('/api/BorrarArti/:id', verificarSesion, verificarAdmin, async (req, res, next) => {
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
router.post('/api/articulos/:id/comentarios', verificarSesion, async (req, res, next) => {
  try {
    const { comentario } = req.body;
    const articulo = await Articulo.findById(req.params.id);

    if (!articulo) {
      return res.status(404).json({
        success: false,
        message: 'El artículo no existe'
      });
    }
    const user = articulo.userId;
    articulo.comentarios.push({
      text: comentario,
      publicadoPor: user
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

// Eliminar un comentario al artículo
router.delete('/api/articulos/:id/comentarios/:comentarioId', verificarSesion, async (req, res, next) => {
  try {
    const articuloId = req.params.id;
    const comentarioId = req.params.comentarioId;

    // Buscar el artículo por ID y el comentario dentro del artículo
    const articulo = await Articulo.findById(articuloId);
    const comentario = articulo.comentarios.id(comentarioId);
    const userId = articulo.userId;

    if (!articulo) {
      return res.status(404).json({
        success: false,
        message: 'El artículo no existe'
      });
    }

    if (!comentario) {
      return res.status(404).json({
        success: false,
        message: 'El comentario no existe'
      });
    }
    // Verificar si el usuario es el propietario del comentario o si es administrador
    if (userId === comentario.usuario || isAdmin) {
      await articulo.updateOne({ $pull: { comentarios: comentario } });
      res.status(200).json({ success: true, message: 'Comentario eliminado correctamente.' });
    } else {
      // El usuario no tiene permisos para eliminar el comentario
      res.status(403).json({ success: false, message: 'No tienes permisos para eliminar este comentario.' });
    }
  } catch (error) {
    next(error);
  }
});

// Darle like a un artículo
router.put('/api/articulos/:id/like', verificarSesion, async (req, res, next) => {
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
router.put('/api/articulos/:id/unlike', verificarSesion, async (req, res, next) => {
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
