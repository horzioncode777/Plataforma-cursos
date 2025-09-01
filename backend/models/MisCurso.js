const mongoose = require("mongoose");
const { Schema } = mongoose;

const misCursoSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Citizen",
    required: true,
  },
  curso: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  fechaInscripcion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MisCurso", misCursoSchema);
