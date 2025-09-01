const mongoose = require("mongoose");

const videoConsejoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  thumbnail: { type: String, required: true },
  titulo: { type: String, required: false }, // opcional
  descripcion: { type: String, required: false }, // opcional
}, { timestamps: true });

module.exports = mongoose.model("VideoConsejo", videoConsejoSchema);
