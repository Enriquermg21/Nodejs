const mongoose = require('mongoose');
const Articulos = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: [true, "titulo requerido"],
        },
        contenido: {
            type: String,
            required: [true, "contenido requerido"],
        },
        publicado: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "usuarios",
        },
        imagen: {
            url: String,
            public_id: String,
        },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "usuarios" }],
        comentarios: [
            {
                text: String,
                created: { type: Date, default: Date.now },
                postedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "usuarios",
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Articulos', Articulos);