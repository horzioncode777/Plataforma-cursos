import mongoose from "mongoose";

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

const MisCurso = mongoose.model("MisCurso", misCursoSchema);
export default MisCurso;
