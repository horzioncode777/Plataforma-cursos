import mongoose from "mongoose";

const masConsejoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true }
});

const MasConsejo = mongoose.model("MasConsejo", masConsejoSchema);
export default MasConsejo;
