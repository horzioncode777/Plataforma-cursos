import mongoose from "mongoose";

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

const Course = mongoose.model("Course", CourseSchema);
export default Course;
