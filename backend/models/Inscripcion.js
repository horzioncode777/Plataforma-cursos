const mongoose = require("mongoose");

const inscripcionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  curso: {
    type: String,
    required: true,
  },
  modalidad: {
    type: String,
    required: true,
  },
  aceptoTratamientoDatos: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Inscripcion", inscripcionSchema);
