const mongoose = require("mongoose");

const moduloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ruta: { type: String, required: true },
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  imagenPlataforma: { type: String },
  linkContenido: { type: String },
  linkModulos: [moduloSchema], // Solo este campo
});

module.exports = mongoose.model("Course", CourseSchema);
