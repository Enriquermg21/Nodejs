const mongoose = require('mongoose');

const SubComentarioSchema = new mongoose.Schema({
  text: String,
  created: { type: Date, default: Date.now },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios',
  },
});

const ComentarioSchema = new mongoose.Schema({
  text: String,
  created: { type: Date, default: Date.now },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios',
  },
  comentarios: [SubComentarioSchema],
});

const ArticuloSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'Título requerido'],
    },
    contenido: {
      type: String,
      required: [true, 'Contenido requerido'],
    },
    publicado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'usuarios',
    },
    imagen: {
      url: String,
      public_id: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'usuarios' }],
    comentarios: [ComentarioSchema],
  },
  { timestamps: true }
);

const Articulo = mongoose.model('Articulo', ArticuloSchema);
const Comentario = mongoose.model('Comentario', ComentarioSchema);

module.exports = Articulo,Comentario;
