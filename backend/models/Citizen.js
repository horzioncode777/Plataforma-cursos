import mongoose from "mongoose";

const citizenSchema = new mongoose.Schema(
  {
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

    cursosInscritos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Citizen = mongoose.model("Citizen", citizenSchema);
export default Citizen;
