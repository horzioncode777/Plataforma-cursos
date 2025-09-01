const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  tipoDocumento: String,
  numeroDocumento: { type: String, unique: true },
  fechaNacimiento: Date,
  genero: String,
  discapacidad: String,
  municipio: String,
  telefono: String,
  email: { type: String, unique: true },
  password: String,
  fotoPerfil: String, // ➕ Ruta de la imagen de perfil

  // ➕ Referencia a los cursos inscritos
  cursosInscritos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model("Citizen", citizenSchema);
