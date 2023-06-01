const mongoose = require('mongoose');
const Articulos = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"],
        },
        content: {
            type: String,
            required: [true, "content is required"],
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "usuarios",
        },
        image: {
            url: String,
            public_id: String,
        },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "usuarios" }],
        comments: [
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